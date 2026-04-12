/**
 * WordPress Dependencies
 */
import TrashIcon from '../../../../../components/icon/trash-icon';

/**
 * Internal Dependencies
 */
import { usePaymentsContext } from '../../../state/context';

const ControlButtons = ( { id } ) => {
	const { deleteProduct } = usePaymentsContext();

	return (
		<div
			className="product-buttons-remove cursor-pointer p-2 rounded-[8px] border border-[#E13B3B] bg-[#fff]"
			onClick={() => deleteProduct(id)}
		>
			<TrashIcon width={24} height={24} />
		</div>
	);
};

export default ControlButtons;
