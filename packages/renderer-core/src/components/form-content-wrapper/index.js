/**
 * WordPress Dependencies
 */
import { useEffect } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
/**
 * QuillForms Dependencies
 */
import { useEditableFields } from '@quillforms/renderer-components';

/**
 * Internal Dependencies
 */
import FormContent from '../form-content';

const FormContentWrapper = ( { applyJumpLogic = true } ) => {
	const editableFields = useEditableFields();
	const { insertEmptyFieldAnswer } = useDispatch(
		'quillForms/renderer-submission'
	);

	useEffect( () => {
		editableFields.map( ( field ) =>
			insertEmptyFieldAnswer( field.id, field.type )
		);
	}, [] );

	return (
		<div className="renderer-core-form-contenet-wrapper">
			<FormContent applyJumpLogic={ applyJumpLogic } />
		</div>
	);
};
export default FormContentWrapper;
