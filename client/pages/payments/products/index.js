/**
 * QuillForms Dependencies
 */
import { BaseControl, ControlWrapper } from '@quillforms/admin-components';

/**
 * Internal Dependencies
 */
import { usePaymentsContext } from '../state/context';
import { randomId } from '../utils';
import Product from './product';
import EmptyIcon from '../../../components/icon/empty-icon';
import AddIcon from '../../../components/icon/add-icon';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

const Products = () => {
	const { products, addProduct } = usePaymentsContext();

	// Find first supported field block and first variable to use as defaults
	const { firstFieldId, firstVariableId } = useSelect((select) => {
		const blocks = select('quillForms/block-editor').getAllBlocks() ?? [];
		const blockTypes = select('quillForms/blocks').getBlockTypes() ?? {};
		const logicVariables =
			select('quillForms/logic-editor')?.getLogic()?.variables ?? {};

		const supportedField = blocks.find((block) => {
			const blockType = blockTypes[block.name];
			if (!blockType || !blockType.supports) return false;
			return (
				blockType.supports.payments &&
				(blockType.supports.numeric || blockType.supports.choices)
			);
		});

		const variableIds = Object.keys(logicVariables);

		return {
			firstFieldId: supportedField?.id,
			firstVariableId: variableIds.length ? variableIds[0] : undefined,
		};
	}, []);

	const entries = Object.entries(products);

	const getGroup = (product) => {
		if (product.source?.type === 'field') return 'field';
		if (product.source?.type === 'variable') return 'variable';
		if (
			product.source?.type === 'other' &&
			product.source?.value === 'defined'
		) {
			return 'defined';
		}
		return product.group ?? 'field';
	};

	const fieldProducts = entries.filter(
		([, product]) => getGroup(product) === 'field'
	);
	const variableProducts = entries.filter(
		([, product]) => getGroup(product) === 'variable'
	);
	const definedPriceProducts = entries.filter(
		([, product]) => getGroup(product) === 'defined'
	);

	const handleAddProduct = (group) => {
		const base = { group };
		let initial = base;

		if (group === 'defined') {
			initial = {
				...base,
				source: { type: 'other', value: 'defined' },
			};
		} else if (group === 'field' && firstFieldId) {
			initial = {
				...base,
				source: { type: 'field', value: firstFieldId },
			};
		} else if (group === 'variable' && firstVariableId) {
			initial = {
				...base,
				source: { type: 'variable', value: firstVariableId },
			};
		}

		addProduct(randomId(), initial);
	};

	const renderSection = (title, items, addLabel, group) => (
		<div className="qf-payments-products-section">
			<div className="qf-payments-products-section__header">
				<div className="qf-payments-products-section__title">{title}</div>
				<button
					type="button"
					className="qf-payments-products-section__add"
					onClick={() => handleAddProduct(group)}
				>
					<AddIcon width={24} height={24} />
					<span>{addLabel}</span>
				</button>
			</div>
			<div className="qf-payments-products-section__body">
				{items.length > 0 ? (
					items.map(([id], index) => (
						<Product key={id} id={id} index={index} />
					))
				) : (
					<div className="qf-payments-products-section__empty">
						<EmptyIcon width={60} height={60} />
						Nothing here for now—Once you add new {title.toLowerCase()},
						it&apos;ll appear here.
					</div>
				)}
			</div>
		</div>
	);

	return (
		<div className="quillforms-payments-page-settings__products">
			<h3 className='!m-0 !text-[#334155] !text-2xl !font-medium'> Products </h3>
			<div className="">
				<BaseControl>
					<ControlWrapper orientation="vertical">
						{renderSection('Fields', fieldProducts, 'Add Field', 'field')}
						{renderSection(
							'Variables',
							variableProducts,
							'Add Variable',
							'variable'
						)}
						{renderSection(
							'Defined Price',
							definedPriceProducts,
							'Add Defined Price',
							'defined'
						)}
					</ControlWrapper>
				</BaseControl>
			</div>
		</div>
	);
};

export default Products;
