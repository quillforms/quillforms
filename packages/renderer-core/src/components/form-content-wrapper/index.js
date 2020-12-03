/**
 * WordPress Dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
/**
 * Internal Dependencies
 */
import FormContent from '../form-content';
import { useEditableFields } from '@quillforms/renderer-components';
import { cloneDeep } from 'lodash';

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
			<FormContent walkPath={ walkPath } setWalkPath={ setWalkPath } />
		</div>
	);
};
export default FormContentWrapper;
