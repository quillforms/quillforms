/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import FieldAction from '../field-action';
import ErrMsg from '../error-message';

const EditableBlockFooter = ( {
	id,
	isSubmitBtnVisible,
	isErrMsgVisible,
	showErrorMessage,
	next,
	shakingErr,
} ) => {
	const { isValid, validationErr } = useSelect( ( select ) => {
		return {
			isValid: select( 'quillForms/renderer-submission' ).isValidField(
				id
			),
			validationErr: select(
				'quillForms/renderer-submission'
			).getFieldValidationErr( id ),
		};
	} );

	return (
		<div className="renderer-components-block-footer">
			{ shakingErr ||
			( ! isValid && validationErr?.length > 0 && isErrMsgVisible ) ? (
				<ErrMsg message={ shakingErr ? shakingErr : validationErr } />
			) : (
				<FieldAction
					show={ isSubmitBtnVisible }
					clickHandler={ () => {
						if ( validationErr && ! isValid ) {
							showErrorMessage( true );
						} else {
							next();
						}
					} }
				/>
			) }
		</div>
	);
};
export default EditableBlockFooter;
