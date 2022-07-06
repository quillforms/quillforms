/**
 * Internal Dependencies
 */
import { usePaymentsContext } from '../../state/context';
import RemoveButton from './remove-button';
import Name from './name';
import Recurring from './recurring';
import Conditions from './conditions';

const Model = ( { id } ) => {
	const { models } = usePaymentsContext();

	const multiple = Object.entries( models ).length > 1;

	return (
		<div
			className={
				'payment-model ' + ( multiple ? 'payment-model-multiple' : '' )
			}
		>
			{ multiple && <RemoveButton id={ id } /> }
			{ multiple && <Name id={ id } /> }
			<Recurring id={ id } />
			<Conditions id={ id } />
		</div>
	);
};

export default Model;
