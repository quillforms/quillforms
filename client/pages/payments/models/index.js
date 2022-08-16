/**
 * QuillForms Dependencies
 */
import { BaseControl, ControlWrapper } from '@quillforms/admin-components';

/**
 * Internal Dependencies
 */
import { usePaymentsContext } from '../state/context';
import AddModel from './add-model';
import Model from './model';

const Models = () => {
	const { models } = usePaymentsContext();

	return (
		<div className="quillforms-payments-page-settings__models">
			<h3> Payment Model(s) </h3>
			<p className="quillforms-payments-page-settings__model-info">
				The price of the model is the total price of products
			</p>
			<div className="quillforms-payments-page-settings__models-content">
				{ Object.keys( models ).map( ( id ) => (
					<Model key={ id } id={ id } />
				) ) }
				<AddModel />
			</div>
		</div>
	);
};

export default Models;
