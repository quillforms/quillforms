import classNames from 'classnames';
import { size } from 'lodash';
import { useEntryRowContext } from './entry-row-context';
import CheckboxControl from './checkbox-control';
import { __ } from '@wordpress/i18n';

const EntryRow = ({ index, data, style }) => {
	const {
		onEntryClick,
		setSelectedEntries,
		selectedEntries,
		activeEntryId,
		selectedField,
	} = useEntryRowContext();
	const entry = data[index];
	return (
		<div
			className={classNames(`qf-entry-list-item`, {
				active: entry.ID === activeEntryId,
				unread: !entry.is_read,
				empty: !entry.records.fields?.[selectedField]?.readable_value,
			})}
			onClick={() => {
				onEntryClick(entry.ID);
			}}
			style={{ ...style }}
		>
			<CheckboxControl
				checkboxStatus={
					size(selectedEntries) > 0 && selectedEntries.includes(entry.ID)
						? 'checked'
						: 'unchecked'
				}
				clicked={() => {
					if (selectedEntries.includes(entry.ID)) {
						setSelectedEntries(
							selectedEntries.filter(
								($entryId) => $entryId !== entry.ID
							)
						);
					} else {
						setSelectedEntries(
							selectedEntries.concat([entry.ID])
						);
					}
				}}
			/>
			<div
				className="qf-entry-list-item__field-value"
				dangerouslySetInnerHTML={{
					__html:
						entry.records.fields?.[selectedField]?.readable_value ??
						'No response',
				}}
			></div>
			<div
				style={{
					display: 'flex',
					gap: '10px',
					alignItems: 'center',
					flex: 2
				}}
			>
				<div className={classNames('qf-entry-list-item__status', {
					'completed': entry.status === 'completed',
					'partial': entry.status === 'partial',
				})}>
					<p className='qf-entry-list-item__status-content'>
						{entry.status === 'completed' ? __('Completed', 'quillforms-entries') : __('Partial', 'quillforms-entries')}
					</p>
				</div>
				<div className="qf-entry-list-item-date">
					{entry.date_created}
				</div>
			</div>
		</div>
	);
};
export default EntryRow;
