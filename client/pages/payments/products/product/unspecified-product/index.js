/**
 * Internal Dependencies
 */
import SourceSelector from '../source-selector';
import ControlButtons from '../control-buttons';

const UnspecifiedProduct = ( { id } ) => {
	return (
		<div className="quillforms-payments-page-settings-product-single">
			<SourceSelector id={ id } />
			<ControlButtons id={ id } />
		</div>
	);
};

export default UnspecifiedProduct;
