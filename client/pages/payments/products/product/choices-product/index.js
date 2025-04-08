/**
 * QuillForms Dependencies
 */
import { TextControl } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import { usePaymentsContext } from '../../../state/context';
import SourceSelector from '../source-selector';
import ControlButtons from '../control-buttons';

/**
 * External Dependencies
 */
import classnames from 'classnames';
import { css } from 'emotion';

const ChoicesProduct = ({ id }) => {
	const { products, updateProduct } = usePaymentsContext();
	const product = products[id];

	const { block, blockType } = useSelect((select) => {
		const allBlocks = select('quillForms/block-editor').getAllBlocks();
		console.log(allBlocks);
		const block = allBlocks.find((block) => {
			return (
				block.id === product.source.value
			);
		});
		if (!block) {
			return { block: null, blockType: null };
		}
		const blockType = select('quillForms/blocks').getBlockType(
			block?.name
		);
		return { block, blockType };
	});
	const choices = blockType.getChoices({
		id,
		attributes: block?.attributes ?? {},
	});

	const charCode = 'a'.charCodeAt(0);
	// Simple algorithm to generate alphabatical idented order
	const identName = (a) => {
		const b = [a];
		let sp, out, i, div;

		sp = 0;
		while (sp < b.length) {
			if (b[sp] > 25) {
				div = Math.floor(b[sp] / 26);
				b[sp + 1] = div - 1;
				b[sp] %= 26;
			}
			sp += 1;
		}

		out = '';
		for (i = 0; i < b.length; i += 1) {
			out = String.fromCharCode(charCode + b[i]) + out;
		}

		return out;
	};

	return (
		<div className="quillforms-payments-page-settings-product-choices">
			<div className="product-choices-header">
				<SourceSelector id={id} />
				<ControlButtons id={id} />
			</div>
			<div className="product-choices-body">
				{choices &&
					choices.map((choice, index) => {
						const label = choice.label;
						const choiceId = choice.value;
						const price = product.choices?.[choiceId]?.price;
						return (
							<div
								key={choiceId}
								className="product-choices-choice"
							>
								<div className="product-choices-choice-label-wrapper">
									<div
										className={classnames(
											'product-choices-choice-label-key',
											css`
												display: flex;
												justify-content: center;
												align-items: center;
												font-size: 11px;
												background: ${blockType.color};
												width: 24px;
												height: 24px;
												border-radius: 3px;
												color: #fff;
												margin-right: 10px;
											`
										)}
									>
										{identName(index).toUpperCase()}
									</div>
									<div className="product-choices-choice-label">
										{label}
									</div>
								</div>
								<div className="product-price ml-3">
									<TextControl
										placeholder="Price"
										type="number"
										value={price ?? ''}
										onChange={(price) =>
											updateProduct(
												id,
												{
													choices: {
														[choiceId]: { price },
													},
												},
												'recursive'
											)
										}
									/>
								</div>
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default ChoicesProduct;
