/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import FieldAction from '../field-action';
import ErrMsg from '../error-message';
import { useFieldRenderContext } from '../field-render';
import { BlockFooterProps } from './index';

interface Props extends BlockFooterProps {
	id: string | undefined;
}
const EditableBlockFooter: React.FC< Props > = ( {
	id,
	isSubmitBtnVisible,
	isErrMsgVisible,
	showErrorMessage,
	shakingErr,
} ) => {
	if ( ! id ) return null;
	const { isValid, validationErr } = useSelect( ( select ) => {
		return {
			isValid: select( 'quillForms/renderer-core' ).isValidField( id ),
			validationErr: select(
				'quillForms/renderer-core'
			).getFieldValidationErr( id ),
		};
	} );
	const { next } = useFieldRenderContext();
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
