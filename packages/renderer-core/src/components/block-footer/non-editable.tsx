/**
 * Internal Dependencies
 */
import FieldAction from '../field-action';
import { useFieldRenderContext } from '../field-render';

const NonEditableBlockFooter = () => {
	const { next } = useFieldRenderContext();
	return (
		<div className="renderer-components-block-footer">
			<FieldAction
				clickHandler={ () => {
					next();
				} }
				show={ true }
			/>
		</div>
	);
};
export default NonEditableBlockFooter;
