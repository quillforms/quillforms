/**
 * QuillForms Dependencies
 */
import { BlockIconBox } from '@quillforms/admin-components';

/**
 * Internal Dependencies
 */
import HiddenFieldIcon from './hidden-field-icon';

const EntryHiddenField = ( { label, value } ) => {
	return (
		<>
			<li>
				<div className="qf-entry-hidden-field-header">
					<BlockIconBox color="#aaa" icon={ HiddenFieldIcon } />
					<div className="qf-entry-hidden-field-header-label">
						{ label }
					</div>
				</div>

				<div className={ 'qf-entry-hidden-field-value' }>
					<div
						dangerouslySetInnerHTML={ {
							__html: value,
						} }
					></div>
				</div>
			</li>
		</>
	);
};
export default EntryHiddenField;
