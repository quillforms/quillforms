import classNames from 'classnames';
import { size } from 'lodash';
import { format } from 'date-fns';
import { useEntryRowContext } from './entry-row-context';
import CheckboxControl from './checkbox-control';
import { __, sprintf } from '@wordpress/i18n';
import TrashIcon from '../../../components/icon/trash-icon';
import CalenderIcon from '../../../components/icon/calender-icon';

const EntryRow = ({ entry }) => {
	const {
		onEntryClick,
		setSelectedEntries,
		selectedEntries,
		activeEntryId,
		selectedField,
		recordsInfo,
		deleteEntry,
	} = useEntryRowContext();

	const isActive = entry.ID === activeEntryId;
	const isSelected = size(selectedEntries) > 0 && selectedEntries.includes(entry.ID);
	const fieldLabel = recordsInfo?.fields?.[selectedField]?.label ?? __('Question', 'quillforms');
	const fieldValue = entry.records.fields?.[selectedField]?.readable_value;
	const formattedDate = entry.date_created
		? format(new Date(entry.date_created), 'dd MMM yyyy, HH:mm')
		: '';

	return (
		<div
			className={classNames('qf-entry-list-item', {
				active: isActive,
				unread: !entry.is_read,
				empty: !fieldValue,
			})}
			onClick={() => onEntryClick(entry.ID)}
		>
			{/* Top row: checkbox + ID + delete icon */}
			<div className="qf-entry-card__top">
				<div className="qf-entry-card__top-left">
					<CheckboxControl
						checkboxStatus={isSelected ? 'checked' : 'unchecked'}
						clicked={(e) => {
							e?.stopPropagation?.();
							if (selectedEntries.includes(entry.ID)) {
								setSelectedEntries(
									selectedEntries.filter(($id) => $id !== entry.ID)
								);
							} else {
								setSelectedEntries(selectedEntries.concat([entry.ID]));
							}
						}}
					/>
					<span className="qf-entry-card__id">
						{`ID: ${entry.ID}`}
					</span>
				</div>
				<button
					className="qf-entry-card__delete-btn"
					onClick={(e) => {
						e.stopPropagation();
						if (deleteEntry) deleteEntry(entry.ID);
					}}
				>
					<TrashIcon width={32} height={32} />
				</button>
			</div>

			{/* Meta row: date + status */}
			<div className="qf-entry-card__meta">
				<div className="qf-entry-card__date">
					<CalenderIcon width={32} height={32} color="#777777" />
					<span className='text-lg font-medium leading-7 text-[#777]'>{formattedDate}</span>
				</div>
				<div className={classNames('qf-entry-card__status', {
					'completed': entry.status === 'completed',
					'partial': entry.status === 'partial',
				})}>
					<span className="qf-entry-card__status-dot">●</span>
					<span>
						{entry.status === 'completed'
							? __('Completed', 'quillforms')
							: __('Partial', 'quillforms')}
					</span>
				</div>
			</div>

			{/* Answer preview card */}
			<div className="qf-entry-card__answer">
				<div
					className="qf-entry-card__answer-label"
					dangerouslySetInnerHTML={{
						__html: sprintf(
							/* translators: %s: question label */
							__(`Answer of Q${entry.ID} `, 'quillforms'),
							fieldLabel
						),
					}}
				/>
				<div
					className="qf-entry-card__answer-value"
					dangerouslySetInnerHTML={{
						__html: fieldValue ?? __('No response', 'quillforms'),
					}}
				/>
			</div>
		</div>
	);
};

export default EntryRow;
