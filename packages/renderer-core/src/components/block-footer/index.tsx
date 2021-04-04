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

export interface BlockFooterProps {
	isSubmitBtnVisible: boolean;
	isErrMsgVisible: boolean;
	showErrorMessage: ( x: boolean ) => void;
	shakingErr: string | null;
}
const BlockFooter: React.FC< BlockFooterProps > = ( {
	isSubmitBtnVisible,
	isErrMsgVisible,
	showErrorMessage,
	shakingErr,
} ) => {
	const { id, blockName } = useFieldRenderContext();
	if ( ! blockName ) return null;
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
				<NonEditableBlockFooter />
			) : (
				<EditableBlockFooter
					id={ id }
					isSubmitBtnVisible={ isSubmitBtnVisible }
					isErrMsgVisible={ isErrMsgVisible }
					showErrorMessage={ showErrorMessage }
					shakingErr={ shakingErr }
				/>
			) }
		</>
	);
};
export default BlockFooter;
