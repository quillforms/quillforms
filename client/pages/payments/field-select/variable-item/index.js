/**
 * QuillForms Dependencies
 */
import { BlockIconBox } from '@quillforms/admin-components';

/**
 * Internal Dependencies
 */
import './style.scss';

const VariableItem = ( { label } ) => {
	return (
		<div className="quillforms-payments-page-variable-item">
			<div
				style={ {
					background: '#3a7685',
				} }
				className="quillforms-payments-page-dropdown-menu-item__hidden-div"
			/>
			<BlockIconBox />
			<div className="quillforms-payments-page-variable-item__label">
				{ label }
			</div>
		</div>
	);
};

export default VariableItem;
