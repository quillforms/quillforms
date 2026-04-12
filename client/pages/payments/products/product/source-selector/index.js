/**
 * QuillForms Dependencies
 */
import { ComboboxControl } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import { usePaymentsContext } from '../../../state/context';

const SourceSelector = ({ id }) => {
	const { products, updateProduct } = usePaymentsContext();
	const product = products[id];

	const { blockTypes } = useSelect((select) => {
		return {
			blockTypes: select('quillForms/blocks').getBlockTypes() ?? {},
		};
	});

	// Field products: dropdown lists only form fields. Variable products: only variables.
	const restrictToSection =
		product.group === 'field' || product.source?.type === 'field'
			? 'fields'
			: product.group === 'variable' || product.source?.type === 'variable'
				? 'variables'
				: null;

	return (
		<div className="product-source-selector">
			<ComboboxControl
				value={product.source ?? {}}
				onChange={(source) =>
					updateProduct(id, { source }, 'set')
				}
				isToggleEnabled={false}
				hideChooseOption={true}
				placeholder={__('Select product source', 'quillforms')}
				customize={(value) => {
					let { sections, options } = value;

					sections = sections.filter((section) =>
						['fields', 'variables'].includes(section.key)
					);
					if (restrictToSection) {
						sections = sections.filter(
							(section) => section.key === restrictToSection
						);
					}

					options = options.filter((option) => {
						if (
							restrictToSection &&
							option.section !== restrictToSection
						) {
							return false;
						}
						if (option.type === 'field') {
							const blockType =
								blockTypes[option.other?.name ?? ''];
							// only supports payments and current known types.
							return (
								blockType?.supports?.payments &&
								(blockType.supports.numeric ||
									blockType.supports.choices)
							);
						} else if (option.type === 'variable') {
							return true;
						} else {
							return false;
						}
					});

					if (!restrictToSection) {
						options.push({
							label: 'Defined Price',
							type: 'other',
							value: 'defined',
						});
					}

					return { sections, options };
				}}
			/>
		</div>
	);
};

export default SourceSelector;
