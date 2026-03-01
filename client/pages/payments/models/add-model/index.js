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
import AddIcon from '../../../../components/icon/add-icon';

const AddButton = () => {
	const { addModel } = usePaymentsContext();

	return (
		<div
			className="add-payment-model text-[#B2328C] text-lg font-medium leading-7 cursor-pointer flex items-center gap-.5"
			onClick={ () =>
				addModel(
					randomId(),
					getModelDefaultState( 'New Payment Model' )
				)
			}
		>
			<AddIcon/>
			<div>{ __( 'Add Another Model', 'quillforms' ) }</div>
		</div>
	);
};

export default AddButton;
