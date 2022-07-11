/**
 * QuillForms Dependencies
 */
import { BaseControl, ControlWrapper } from '@quillforms/admin-components';

/**
 * Internal Dependencies
 */
import { usePaymentsContext } from '../state/context';
import AddButton from './add-button';
import Product from './product';

const Products = () => {
	const { products } = usePaymentsContext();

	return (
		<div className="quillforms-payments-page-settings__products">
			<h3> Products </h3>
			<div className="quillforms-payments-page-settings__products-content">
				<BaseControl>
					<ControlWrapper orientation="vertical">
						<div>
							{ Object.keys( products ).map( ( id ) => (
								<Product key={ id } id={ id } />
							) ) }
						</div>
						<AddButton />
					</ControlWrapper>
				</BaseControl>
			</div>
		</div>
	);
};

export default Products;
