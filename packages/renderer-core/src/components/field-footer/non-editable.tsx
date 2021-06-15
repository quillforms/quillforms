/**
 * Internal Dependencies
 */
import FieldAction from '../field-action';
import { __experimentalUseFieldRenderContext } from '../field-render';
import SubmitBtn from '../submit-btn';

const NonEditableBlockFooter = () => {
	const { next, isLastField } = __experimentalUseFieldRenderContext();
	return (
		<div className="renderer-components-block-footer">
			{ isLastField ? (
				<SubmitBtn />
			) : (
				<FieldAction
					show={ true }
					clickHandler={ () => {
						next();
					} }
				/>
			) }
		</div>
	);
};
export default NonEditableBlockFooter;
