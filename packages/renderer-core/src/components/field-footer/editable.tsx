/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import FieldAction from '../field-action';
import ErrMsg from '../error-message';
import { __experimentalUseFieldRenderContext } from '../field-render';
import SubmitBtn from '../submit-btn';

interface Props {
	id: string | undefined;
	shakingErr: string | null;
}
const EditableBlockFooter: React.FC< Props > = ( { id, shakingErr } ) => {
	if ( ! id ) return null;
	const { isValid, validationErr } = useSelect( ( select ) => {
		return {
			isValid: select( 'quillForms/renderer-core' ).isValidField( id ),
			validationErr: select(
				'quillForms/renderer-core'
			).getFieldValidationErr( id ),
		};
	} );
	const {
		next,
		isErrMsgVisible,
		showErrMsg,
		isLastField,
	} = __experimentalUseFieldRenderContext();
	return (
		<>
			{ shakingErr ||
			( ! isValid && validationErr?.length > 0 && isErrMsgVisible ) ? (
				// @ts-expect-error
				<ErrMsg message={ shakingErr ? shakingErr : validationErr } />
			) : isLastField ? (
				<SubmitBtn />
			) : (
				// @ts-expect-error
				<FieldAction
					clickHandler={ () => {
						if ( validationErr && ! isValid ) {
							showErrMsg( true );
						} else {
							next();
						}
					} }
				/>
			) }
		</>
	);
};
export default EditableBlockFooter;
