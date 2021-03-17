/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import EditableBlockFooter from './editable';
import NonEditableBlockFooter from './non-editable';
import { useFieldRenderContext } from '../field-render';
const BlockFooter = ( {
	isSubmitBtnVisible,
	isErrMsgVisible,
	showErrorMessage,
	next,
	shakingErr,
} ) => {
	const { id, blockName } = useFieldRenderContext();
	const { isEditable } = useSelect( ( select ) => {
		return {
			isEditable: select( 'quillForms/blocks' ).hasBlockSupport(
				blockName,
				'editable'
			),
		};
	} );
	return (
		<>
			{ ! isEditable ? (
				<NonEditableBlockFooter
					isSubmitBtnVisible={ isSubmitBtnVisible }
					next={ next }
				/>
			) : (
				<EditableBlockFooter
					id={ id }
					isSubmitBtnVisible={ isSubmitBtnVisible }
					isErrMsgVisible={ isErrMsgVisible }
					showErrorMessage={ showErrorMessage }
					shakingErr={ shakingErr }
					next={ next }
				/>
			) }
		</>
	);
};
export default BlockFooter;
