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

const NumericProduct = ({ id, index }) => {
	const { products, updateProduct } = usePaymentsContext();
	const product = products[id];
	const isVariable =
		product.group === 'variable' || product.source?.type === 'variable';

	if (isVariable) {
		return (
			<div className="quillforms-payments-page-settings-product-variable">
				<div className="product-variable-header">
					<div className="product-variable-title">
						Variable {typeof index === 'number' ? `(${index + 1})` : ''}
					</div>
					<ControlButtons id={id} />
				</div>
				<div className=' w-full h-[1px] bg-[#D9D9D9] my-4'></div>
				<div className="product-variable-body">
					<SourceSelector id={id} />
					<TextControl
						className="product-name"
						placeholder="Enter Product name"
						value={product.name ?? ''}
						onChange={(name) => updateProduct(id, { name })}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="quillforms-payments-page-settings-product-single">
			<SourceSelector id={id} />
			<TextControl
				className="product-name"
				placeholder="Product name"
				value={product.name ?? ''}
				onChange={(name) => updateProduct(id, { name })}
			/>
			<ControlButtons id={id} />
		</div>
	);
};

export default NumericProduct;
