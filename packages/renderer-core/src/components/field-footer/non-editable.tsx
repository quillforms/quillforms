/**
 * Internal Dependencies
 */
import FieldAction from '../field-action';
import { useFieldRenderContext } from '../field-render';
import SubmitBtn from '../submission-screen';

const NonEditableBlockFooter = () => {
	const { next, isLastField } = useFieldRenderContext();
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
