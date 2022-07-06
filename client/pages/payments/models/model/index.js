/**
 * Internal Dependencies
 */
import { usePaymentsContext } from '../../state/context';
import RemoveButton from './remove-button';
import Name from './name';
import Recurring from './recurring';
import Methods from './methods';
import Conditions from './conditions';
import GatewaysOptions from './gateways-options';

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
			<Methods id={ id } />
			<GatewaysOptions id={ id } />
			<Conditions id={ id } />
		</div>
	);
};

export default Model;
