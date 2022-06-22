/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { Icon, plusCircle } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import { usePaymentsContext } from '../../state/context';
import { randomId } from '../../utils';

const AddButton = () => {
	const { addProduct } = usePaymentsContext();

	return (
		<Button
			className="add-product"
			isPrimary
			onClick={ () => addProduct( randomId(), {} ) }
		>
			<Icon icon={ plusCircle } />
			{ __( 'Add Product', 'quillforms' ) }
		</Button>
	);
};

export default AddButton;
