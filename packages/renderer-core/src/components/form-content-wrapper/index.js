/**
 * WordPress Dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
/**
 * QuillForms Dependencies
 */
import { useEditableFields } from '@quillforms/renderer-components';

/**
 * External Dependencies
 */
import { concat } from 'lodash';
/**
 * Internal Dependencies
 */
import FormContent from '../form-content';

const FormContentWrapper = ( { applyJumpLogic } ) => {
	const editableFields = useEditableFields();
	const [ walkPath, setWalkPath ] = useState( [] );
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
			<FormContent
				walkPath={ concat( walkPath, {
					id: 'default-thankyou-screen',
					type: 'thankyou-screen',
				} ) }
				setWalkPath={ setWalkPath }
			/>
		</div>
	);
};
export default FormContentWrapper;
