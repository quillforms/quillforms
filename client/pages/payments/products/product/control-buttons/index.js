/**
 * WordPress Dependencies
 */
import { Icon } from '@wordpress/components';
import { closeSmall } from '@wordpress/icons';

/**
 * Internal Dependencies
 */
import { usePaymentsContext } from '../../../state/context';

const ControlButtons = ( { id } ) => {
	const { deleteProduct } = usePaymentsContext();

	return (
		<div className="product-buttons">
			<div className="product-buttons-remove">
				<Icon
					icon={ closeSmall }
					onClick={ () => deleteProduct( id ) }
				/>
			</div>
		</div>
	);
};

export default ControlButtons;
