/**
 * QuillForms Dependencies
 */
import {
	SelectControl,
	BlockIconBox,
	Button,
} from '@quillforms/admin-components';
import { Button as MuiButton } from '@mui/material';
import { getPlainExcerpt } from '@quillforms/rich-text';
import ConfigAPI from '@quillforms/config';
import noEntriesImage from '../../../../assets/images/no-entries.png';

/**
 * WordPress Dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { applyFilters } from '@wordpress/hooks';

/**
 * External Dependencies
 */
import { ThreeDots } from 'react-loader-spinner';
import { css } from 'emotion';
import { orderBy as _orderBy, size } from 'lodash';
import { FixedSizeList as List } from 'react-window';
import classnames from 'classnames';
import ReactPaginate from 'react-paginate';
import { DateRangePicker } from 'react-date-range';
import Popover from '@mui/material/Popover';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import DateIcon from '@mui/icons-material/DateRange';
import { parseISO } from 'date-fns';
import TrashIcon from '../../../components/icon/trash-icon';

/**
 * Internal Dependencies
 */
import CheckboxControl from './checkbox-control';
import { EntryRowContextProvider } from './entry-row-context';
import { EntryDetails } from './entry-details';
import EntryRow from './entry-row';
import EntriesExportButton from './entries-export-button';
import DeleteAlertModal from './delete-alert';
import EmptyEntries from './empty-entries';
import EntriesHeader from './entry-header';
import PartialSubmissionBanner from './partial-submission-banner';
import CustomButton from '../../../components/custom-button';
export const EntriesList = ({
	formId
}) => {
	const [page, setPage] = useState(1);
	const [perPage] = useState(30);
	const [totalEntries, setTotalEntries] = useState(undefined);
	let [entries, setEntries] = useState(undefined);
	const [recordsInfo, setRecordsInfo] = useState(undefined);

	const [orderBy, setOrderBy] = useState(0);
	const [order, setOrder] = useState(1);
	const [selectedField, setSelectedField] = useState(
		undefined
	);
	const [from, setFrom] = useState(''); // YYYY-MM-DD HH:MM:SS
	const [to, setTo] = useState(''); // YYYY-MM-DD HH:MM:SS
	const [openDateRangePicker, setOpenDateRangePicker] =
		useState(false);

	useEffect(() => {
		filterEntriesByDate();
	}, [formId, page, perPage]);

	const filterEntriesByDate = () => {
		setEntries(undefined);
		apiFetch({
			path: addQueryArgs(`/qf/v1/forms/${formId}/entries`, {
				page,
				per_page: perPage,
				to: to,
				from: from,
			}),
			method: 'GET',
		}).then((res) => {
			setRecordsInfo(res.records_info);
			setSelectedField(Object.keys(res.records_info.fields)[0]);
			setEntries(res.items);
			setTotalEntries(res.total_items);
		});
	};

	const deleteEntries = (ids) => {
		setTotalEntries(totalEntries - ids.length);
		setEntries(entries.filter((entry) => !ids.includes(entry.ID)));
	};

	const onEntryOpen = (entryId) => {
		if (!Array.isArray(entries)) return;
		// Setting is read = true before the request is sent to the server to update it immeditely in front end.
		const entryIndex = entries.findIndex(
			(entry) => entry.ID === entryId
		);
		const entry = entries[entryIndex];
		if (entry && !entry.is_read) {
			setEntries((prev) => {
				var entries = [...prev];
				entries[entryIndex].is_read = 1;
				return entries;
			});
			apiFetch({
				path: `/qf/v1/forms/${formId}/entries/${entryId}`,
				method: 'POST',
				data: {
					is_read: 1,
				},
			});
		}
	};


	const [selectedEntries, setSelectedEntries] = useState([]);
	const [deleteModelOpen, setDeleteModalOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [showPartialSubmissionBanner, setShowPartialSubmissionBanner] = useState(true);
	// Order entries
	// In case of readable_value, strip it from html tags.
	entries = entries !== undefined ? _orderBy(entries, (o) => {
		return orderBy === 0
			? o.date_created
			: o.records?.fields?.[selectedField]?.readable_value
				?.toLowerCase()
				.replace(/<\/?[^>]+(>|$)/g, '');
	}) : entries;
	if (order === 1 && entries !== undefined) {
		entries = entries.reverse();
	}
	const [activeEntryId, setActiveEntryId] = useState(null); // null for no entry to show

	useEffect(() => {
		if (
			entries !== undefined && entries.findIndex((entry) => entry.ID === activeEntryId) === -1
		)
			setActiveEntryId(entries[0]?.ID);
	}, [totalEntries]);

	useEffect(() => {
		if (activeEntryId) onEntryOpen(activeEntryId);
	}, [activeEntryId]);

	const onEntryClick = (id) => setActiveEntryId(id);

	const { blockTypes } = useSelect((select) => {
		return {
			blockTypes: select('quillForms/blocks').getBlockTypes(),
		};
	});

	const doesPartialSubmissionPointExist = ConfigAPI.getInitialPayload()?.blocks?.some(
		(block) => block?.name === 'partial-submission-point'
	);

	const onDelete = () => {
		setIsDeleting(true);
		let ids = selectedEntries.join(',');
		apiFetch({
			path: `/qf/v1/forms/${formId}/entries?ids=${ids}`,
			method: 'DELETE',
		})
			.then(() => {
				setSelectedEntries([]);
				deleteEntries(selectedEntries);
				setDeleteModalOpen(false);
			})
			.finally(() => {
				location.reload();
				setIsDeleting(false);
			});
	};

	const list = Array.isArray(entries) ? (
		<>
			<div className="qf_entry-list-responses-count">
				<div className='flex justify-between items-center border-b border-[#D9D9D9] pb-5'>
					<div className="qf_entry-list-actions flex items-center text-lg font-semibold leading-7 ">
						<CheckboxControl
							checkboxStatus={
								size(selectedEntries) === size(entries)
									? 'checked'
									: size(selectedEntries) === 0
										? 'unchecked'
										: 'mixed'
							}
							clicked={() => {
								if (size(selectedEntries) > 0) {
									setSelectedEntries([]);
								} else {
									setSelectedEntries(
										entries.map(($entry) => $entry.ID)
									);
								}
							}}
						/>
						{__('Select all', 'quillforms')}
					</div>

					<div className="flex items-center gap-3">
						{applyFilters(
							'QuillForms.Entries.ExportButton.Render',
							<EntriesExportButton
								formId={formId}
								selectedIds={selectedEntries}
							/>,
							{ formId, selectedEntries, from, to }
						)}

						{selectedEntries.length > 0 && (
							<div className="flex items-center gap-3 pl-3 border-l border-[#D9D9D9]">
								<button
									type="button"
									className={css`
										background: transparent;
										border: none;
										color: #E13B3B;
										font-size: 18px;
										font-weight: 500;
										line-height: 28px;
										display: inline-flex;
										align-items: center;
										gap: 6px;
										cursor: pointer;

									`}
									onClick={() => setDeleteModalOpen(true)}
								>
									<span>{__('Delete all', 'quillforms')}</span>
									<TrashIcon width={24} height={24} />
								</button>
							</div>
						)}
					</div>
				</div>
			</div>

			<EntryRowContextProvider // It is important to return the same object if props haven't
				// changed to avoid  unnecessary rerenders.
				// See https://reactjs.org/docs/context.html#caveats.
				value={
					{
						onEntryClick,
						setSelectedEntries,
						selectedEntries,
						activeEntryId,
						selectedField,
						recordsInfo,
						formId,
						deleteEntry: ($activeEntryId) => {
							setSelectedEntries(
								selectedEntries.filter((a) => a !== $activeEntryId)
							);
							deleteEntries([$activeEntryId]);
						},
					}
				}
			>
				<div className="qf_entry-list-items__wrapper">
					{entries.map((entry) => (
						<EntryRow key={entry.ID} entry={entry} />
					))}
				</div>
			</EntryRowContextProvider>
		</>
	) : (
		entries
	);

	let options = {};
	if (recordsInfo?.fields) {
		options = Object.entries(recordsInfo.fields).map(
			([id, field], index) => {
				const blockType = blockTypes[field.name];
				return {
					name: (
						<div
							className={css`
								display: flex;
								align-items: center;
							` }
						>
							<BlockIconBox
								icon={blockType?.icon}
								color={blockType?.color}
							/>
							<div
								className={css`
									margin-left: 5px;
								` }
								dangerouslySetInnerHTML={{
									__html: field.label
										? getPlainExcerpt(field.label)
										: '...'
								}}

							>
							</div>

						</div>
					),
					key: id,
				};
			}
		);
	}

	const orderByOptions = [
		{
			name: __('Submission Date', 'quillforms'),
			key: 'date',
		},
		{
			name: __('Alphabetically', 'quillforms'),
			key: 'alphabetically',
		},
	];

	const orderOptions = [
		{
			name: __('Ascending', 'quillforms'),
			key: 'asc',
		},
		{
			name: __('Descending', 'quillforms'),
			key: 'desc',
		},
	];

	return (
		<>

			{showPartialSubmissionBanner && !doesPartialSubmissionPointExist && (
				<PartialSubmissionBanner
					onDismiss={() => setShowPartialSubmissionBanner(false)}
				/>
			)}

			{entries === undefined ? (
				<div
					className={css`
					display: flex;
					flex-wrap: wrap;
					width: 100%;
					min-height: 100vh;
					justify-content: center;
					align-items: center;
				` }
				>
					<ThreeDots color="#8640e3" height={50} width={50} />
				</div>
			) : (
				<>
					{entries !== undefined &&
						<div
							className={css`
			background: #F2F4FC;
			border-radius: 16px;
			padding: 20px;
			.admin-components-select-control {
				flex: 1 1;

				.components-custom-select-control__button.components-custom-select-control__button {
					padding: 20px 16px;
				}
				.components-custom-select-control__label {
					margin-bottom: 0;
				}
			}
		` }
						>

							<EntriesHeader
								from={from}
								to={to}
								setFrom={setFrom}
								setTo={setTo}
								filterEntriesByDate={filterEntriesByDate}
								setOpenDateRangePicker={setOpenDateRangePicker}
								selectedField={selectedField}
								setSelectedField={setSelectedField}
								orderBy={orderBy}
								order={order}
								setOrder={setOrder}
								setOrderBy={setOrderBy}
								totalEntries={totalEntries}
								options={options}
								orderByOptions={orderByOptions}
								orderOptions={orderOptions}
							/>
							{totalEntries > 0 && (
								<>
									<div className="grid grid-cols-[1fr_2fr] items-start mt-5 gap-5 w-full h-full">
										<div className="qf-entry-list">
											<div className="qf-entry-list__scrollable">
												{list}
											</div>
											<ReactPaginate
												breakLabel={'...'}
												marginPagesDisplayed={2}
												pageRangeDisplayed={3}
												pageCount={Math.ceil(totalEntries / perPage)}
												onPageChange={(newPage) => {
													setPage(newPage.selected + 1);
												}}
												forcePage={page - 1}
												containerClassName={'qf-entries-pagination'}
												activeClassName={'active'}
												pageClassName={css`
												margin: 0 5px;
												padding: 10px;
												border-radius: 32px;
												color: #B2328C;
												cursor: pointer;
											` }
												previousClassName={css`
												margin: 0 5px;
												padding: 5px 10px;
												border-radius: 3px;
												color: #0073aa;
												cursor: pointer;
											` }
												nextClassName={css`
												margin: 0 5px;
												padding: 5px 10px;
												border-radius: 3px;
												color: #0073aa;
												cursor: pointer;
											` }
												breakClassName={css`
												margin: 0 5px;
												padding: 5px 10px;
												border-radius: 3px;
												color: #0073aa;
												cursor: pointer;
										`}
											/>
										</div>
										<EntryDetails
											recordsInfo={recordsInfo}
											deleteEntry={($activeEntryId) => {
												setSelectedEntries(
													selectedEntries.filter(
														(a) => a !== $activeEntryId
													)
												);
												deleteEntries([$activeEntryId]);
											}}
											formId={formId}
											entry={
												entries?.find(
													(entry) => entry.ID === activeEntryId
												) ?? null
											}
										/>
									</div>
									{deleteModelOpen && (
										<DeleteAlertModal
											isDeleting={isDeleting}
											closeModal={() => {
												setDeleteModalOpen(false);
											}}
											approve={() => {
												onDelete();
											}}
										/>
									)}
								</>
							)}
							{totalEntries === 0 && (
								<div className="qf-entry-list__no-entries">
									<img src={noEntriesImage} alt="No Entries" />
									<p
										className={css`
						font-size: 24px;
						font-weight: 700;
						margin-bottom: 12px;
					` }
									>
										{__('No responses received yet', 'quillforms')}
									</p>
									<p className={css`
									color: #777;
									font-size: 18px;
									font-weight: 500;
									line-height: 28px;
									text-align: center;
										`}>{__("You haven’t collected any responses so far. Share your form to start seeing results", 'quillforms')}</p>
									<div
										className={css`
											margin-top: 16px;
										` }
									>
										<CustomButton
											variant="outlineSecondary"
											text={__('Share your form', 'quillforms')}
											className="!py-3 !px-24 !rounded-[16px]"
											onClick={() => {
												// Open form share/settings page in a new tab
												const shareUrl = window?.qfCurrentFormEditUrl || window?.location?.href;
												window.open(shareUrl, '_blank');
											}}
										/>
									</div>
								</div>
							)}
						</div>}
				</>
			)
			}
		</>
	)
}
