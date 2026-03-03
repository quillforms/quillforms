/**
 * QuillForms Dependencies
 */
import { TextControl } from '@quillforms/admin-components';

/**
 * WordPress Dependencies



/**
 * Internal Dependencies
 */
import { usePaymentsContext } from '../../../state/context';
import { randomId } from '../../../utils';
import ControlButtons from '../control-buttons';

const DefinedProduct = ({ id, index }) => {
	const { products, updateProduct, addProduct } = usePaymentsContext();
	const product = products[id];

	const handleAddAnother = () => {
		addProduct(
			randomId(),
			{
				group: 'defined',
				source: { type: 'other', value: 'defined' },
			}
		);
	};

	return (
		<div className="quillforms-payments-page-settings-product-defined">
			<div className="product-defined-header">
				<div className="product-defined-title">
					Defined Price {typeof index === 'number' ? `(${index + 1})` : ''}
				</div>
				<ControlButtons id={id} />
			</div>
			<div className="product-defined-body">
				<TextControl
					className="product-name"
					placeholder="Enter Product name"
					value={product.name ?? ''}
					onChange={(name) => updateProduct(id, { name })}
				/>
				<TextControl
					className="product-price"
					placeholder="Enter Price"
					type="number"
					value={product.price ?? ''}
					onChange={(price) => updateProduct(id, { price })}
				/>
			</div>
		</div>
	);
};

export default DefinedProduct;
