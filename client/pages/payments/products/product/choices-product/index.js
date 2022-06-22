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

const ChoicesProduct = ( { id } ) => {
	const { products, updateProduct } = usePaymentsContext();
	const product = products[ id ];

	const { block } = useSelect( ( select ) => {
		return {
			block: select( 'quillForms/block-editor' ).getBlockById(
				product.source.value
			),
		};
	} );
	const choices = block?.attributes?.choices;

	return (
		<div className="quillforms-payments-page-settings-product-choices">
			<div className="product-choices-header">
				<SourceSelector id={ id } />
				<ControlButtons id={ id } />
			</div>
			<div className="product-choices-body">
				{ choices &&
					choices.map( ( choice ) => {
						const label = choice.label;
						const choiceId = choice.value;
						const price = product.choices?.[ choiceId ]?.price;
						return (
							<div
								key={ choiceId }
								className="product-choices-choice"
							>
								<div>{ label }:</div>
								<div className="product-price ml-3">
									<TextControl
										placeholder="Price"
										type="number"
										value={ price ?? '' }
										onChange={ ( price ) =>
											updateProduct(
												id,
												{
													choices: {
														[ choiceId ]: { price },
													},
												},
												'recursive'
											)
										}
									/>
								</div>
							</div>
						);
					} ) }
			</div>
		</div>
	);
};

export default ChoicesProduct;
