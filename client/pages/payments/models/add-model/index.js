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
		<div
			className="add-payment-model"
			onClick={ () =>
				addModel(
					randomId(),
					getModelDefaultState( 'New Payment Model' )
				)
			}
		>
			<div>
				<Icon icon={ plusCircle } color="#fff" />
			</div>
			<div>{ __( 'Add Another Model', 'quillforms' ) }</div>
		</div>
	);
};

export default AddButton;
