/**
 * QuillForms Dependencies
 */
import { TextControl } from '@quillforms/admin-components';

/**
 * Internal Dependencies
 */
import { usePaymentsContext } from '../../../state/context';
import SourceSelector from '../source-selector';
import ControlButtons from '../control-buttons';

const DefinedProduct = ( { id } ) => {
	const { products, updateProduct } = usePaymentsContext();
	const product = products[ id ];

	return (
		<div className="quillforms-payments-page-settings-product-single">
			<SourceSelector id={ id } />
			<TextControl
				className="product-name ml-3"
				placeholder="Product name"
				value={ product.name ?? '' }
				onChange={ ( name ) => updateProduct( id, { name } ) }
			/>
			<TextControl
				className="product-price ml-3"
				placeholder="Price"
				type="number"
				value={ product.price ?? '' }
				onChange={ ( price ) => updateProduct( id, { price } ) }
			/>
			<ControlButtons id={ id } />
		</div>
	);
};

export default DefinedProduct;
