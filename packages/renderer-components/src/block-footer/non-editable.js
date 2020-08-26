/**
 * Internal Dependencies
 */
import FieldAction from '../field-action';

const NonEditableBlockFooter = ( { next } ) => {
	return (
		<div className="renderer-components-block-footer">
			<FieldAction
				clickHandler={ () => {
					next();
				} }
			/>
		</div>
	);
};
export default NonEditableBlockFooter;
