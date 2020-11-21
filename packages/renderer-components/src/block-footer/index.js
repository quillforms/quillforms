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
	isReviewing,
	isSubmitBtnVisible,
	isErrMsgVisible,
	showErrorMessage,
	next,
	shakingErr,
} ) => {
	const { field } = useFieldRenderContext();
	const { isEditable } = useSelect( ( select ) => {
		return {
			isEditable: select( 'quillForms/blocks' ).hasBlockSupport(
				field.type,
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
					id={ field.id }
					isSubmitBtnVisible={ isSubmitBtnVisible }
					isErrMsgVisible={ isErrMsgVisible }
					showErrorMessage={ showErrorMessage }
					shakingErr={ shakingErr }
					isReviewing={ isReviewing }
					next={ next }
				/>
			) }
		</>
	);
};
export default BlockFooter;
