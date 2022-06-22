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
import { getModelDefaultState, randomId } from '../../utils';

const AddButton = () => {
	const { addModel } = usePaymentsContext();

	return (
		<Button
			className="add-model"
			isPrimary
			onClick={ () =>
				addModel(
					randomId(),
					getModelDefaultState( 'New Payment Model' )
				)
			}
		>
			<Icon icon={ plusCircle } />
			{ __( 'Add Another Model', 'quillforms' ) }
		</Button>
	);
};

export default AddButton;
