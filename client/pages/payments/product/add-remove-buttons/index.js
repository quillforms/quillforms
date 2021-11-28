/**
 * WordPress Dependencies
 */
import { plus, minus } from '@wordpress/icons';
import { Icon } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import './style.scss';
import { useProductContext } from '../context';

const AddRemoveButtons = () => {
	const { onAdd, onRemove, removeEnabled } = useProductContext();

	return (
		<div className="quillforms-payments-page-settings-product-buttons">
			{ removeEnabled && (
				<div className="quillforms-payments-page-settings-product-remove">
					<Icon icon={ minus } onClick={ onRemove } />
				</div>
			) }
			<div className="quillforms-payments-page-settings-product-add">
				<Icon icon={ plus } onClick={ onAdd } />
			</div>
		</div>
	);
};

export default AddRemoveButtons;
