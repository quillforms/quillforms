/**
 * QuillForms Dependencies
 */
import { getRestField } from '@quillforms/rest-fields';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

const useMetaField = ( slug ) => {
	const restField = getRestField( slug );
	const { restFieldVal } = useSelect( ( select ) => {
		return {
			restFieldVal: !! restField ? restField.getValue( select ) : null,
		};
	} );

	return restFieldVal;
};
export default useMetaField;
