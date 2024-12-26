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
				<div>
					{`${totalEntries} responses in total`}
				</div>
				<div className="qf_entry-list-actions">
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
					Select All
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
					}
				}
			>
				<List
					className="qf_entry-list-items__wrapper"
					height={350}
					width={'100%'}
					itemCount={entries.length}
					itemSize={50}
					itemData={entries}
				>
					{EntryRow}
				</List>
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
			name: 'Submission Date',
			key: 'date',
		},
		{
			name: 'Alphabatically',
			key: 'alphabatically',
		},
	];

	const orderOptions = [
		{
			name: 'Ascending',
			key: 'asc',
		},
		{
			name: 'Descending',
			key: 'desc',
		},
	];

	return (
		<>

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
								options={options}
								orderByOptions={orderByOptions}
								orderOptions={orderOptions}
							/>
							{totalEntries > 0 && (
								<>
									<div
										className={css`
									display: flex;
									margin-top: 30px;
								` }
									>
										<div className="qf-entry-list">
											{list}
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
												padding: 5px 10px;
												border-radius: 3px;
												color: #0073aa;
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

											<div
												className={classnames('qf-entry-list__footer', {
													'with-selected-entries': selectedEntries.length > 0,
												})}
											>
												{!selectedEntries || selectedEntries.length === 0 ? (
													applyFilters('QuillForms.Entries.ExportButton.Render', (
														<EntriesExportButton formId={formId} from={from} to={to} />
													), { formId, selectedEntries: [], from, to })

												) : (
													<>
														<div
															className={css`
										width: 70px;
									` }
														>
															{selectedEntries.length} selected
														</div>
														{applyFilters('QuillForms.Entries.ExportButton.Render', (
															<EntriesExportButton
																formId={formId}
																selectedIds={selectedEntries}
															/>
														), { formId, selectedEntries, from, to })}
														<Button
															isDanger
															isButton
															onClick={() => setDeleteModalOpen(true)}
														>
															Delete
														</Button>
													</>
												)}
											</div>
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
						</div>}
					{totalEntries === 0 && (
						<div className="qf-entry-list__no-entries">
							<EmptyEntries />
							<p
								className={css`
						font-size: 22px;
						margin-bottom: 0;
					` }
							>
								No Entries found!
							</p>
							<p>This form doesn’t have any responses yet.</p>
						</div>
					)}
				</>
			)
			}
		</>
	)
}