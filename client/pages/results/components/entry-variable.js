/**
 * QuillForms Dependencies
 */
import { BlockIconBox } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import classnames from 'classnames';

const EntryVariable = ( { label, value } ) => {
	return (
		<>
			<li>
				<div className="qf-entry-variable-header">
					<BlockIconBox />
					<div className="qf-entry-variable-header-label">
						{ label }
					</div>
				</div>

				<div className={ 'qf-entry-variable-value' }>
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
export default EntryVariable;
