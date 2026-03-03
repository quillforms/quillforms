/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import './style.scss';
import { usePaymentsContext } from '../../state/context';
import DefinedProduct from './defined-product';
import NumericProduct from './numeric-product';
import ChoicesProduct from './choices-product';
import UnspecifiedProduct from './unspecified-product';

const Product = ({ id, index }) => {
	const { products, errors } = usePaymentsContext();
	const product = products[id];

	const { blocks, blockTypes, variables } = useSelect((select) => {
		return {
			blocks: select('quillForms/block-editor').getAllBlocks() ?? [],
			blockTypes: select('quillForms/blocks').getBlockTypes() ?? {},
			variables: select('quillForms/logic-editor')?.getLogic()?.variables ?? [],
		};
	});

	let element;
	const isDefined =
		product.source?.type === 'other' && product.source?.value === 'defined';
	const isField =
		product.source?.type === 'field';

	if (product.source) {
		switch (product.source.type) {
			case 'field':
				const block = blocks.find(
					(block) => block.id === product.source.value
				);
				if (block) {
					const blockType = blockTypes[block.name];
					if (blockType.supports.numeric) {
						element = <NumericProduct id={id} index={index} />;
					} else if (blockType.supports.choices) {
						element = <ChoicesProduct id={id} index={index} />;
					}
				}
				break;
			case 'variable':
				element = <NumericProduct id={id} index={index} />;
				break;
			case 'other':
				if (product.source.value === 'defined') {
					element = <DefinedProduct id={id} index={index} />;
				}
				break;
		}
	}

	if (!element) {
		element = <UnspecifiedProduct id={id} />;
	}

	return (
		<div
			className={
				'quillforms-payments-page-settings-product' +
				(isDefined
					? ' quillforms-payments-page-settings-product--defined-wrapper'
					: '') +
				(isField
					? ' quillforms-payments-page-settings-product--field-wrapper'
					: '')
			}
		>
			{element}
			{errors.products[id] && (
				<div className="quillforms-payments-page-settings-product-error">
					{errors.products[id]}
				</div>
			)}
		</div>
	);
};

export default Product;
