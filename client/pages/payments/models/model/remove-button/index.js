/**
 * WordPress Dependencies
 */
import { Icon } from '@wordpress/components';
import { closeSmall } from '@wordpress/icons';

/**
 * Internal Dependencies
 */
import { usePaymentsContext } from '../../../state/context';

const RemoveButton = ( { id } ) => {
	const { deleteModel } = usePaymentsContext();

	return (
		<div className="payment-model-remove-button">
			<Icon
				icon={ closeSmall }
				onClick={ () => {
					deleteModel( id );
				} }
			/>
		</div>
	);
};

export default RemoveButton;
