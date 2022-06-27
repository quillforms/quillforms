/**
 * QuillForms Dependencies
 */
import { BaseControl, ControlWrapper } from '@quillforms/admin-components';

/**
 * Internal Dependencies
 */
import { usePaymentsContext } from '../state/context';
import AddButton from './add-button';
import Model from './model';

const Models = () => {
	const { models } = usePaymentsContext();

	return (
		<div className="quillforms-payments-page-settings__models">
			<h3> Models </h3>
			<BaseControl>
				<ControlWrapper orientation="vertical">
					<div>
						{ Object.keys( models ).map( ( id ) => (
							<Model key={ id } id={ id } />
						) ) }
					</div>
					<AddButton />
				</ControlWrapper>
			</BaseControl>
		</div>
	);
};

export default Models;
