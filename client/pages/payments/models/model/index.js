/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import { usePaymentsContext } from '../../state/context';
import RemoveButton from './remove-button';
import Name from './name';
import Recurring from './recurring';
import Conditions from './conditions';

const Model = ({ id, index }) => {
	const { models } = usePaymentsContext();

	const multiple = Object.entries(models).length > 1;

	return (
		<div
			className={
				'payment-model ' + (multiple ? 'payment-model-multiple' : '')
			}
		>
			<h4 className="payment-model-title">
				{__('Payment Model', 'quillforms')} ({index})
			</h4>
			{multiple && <RemoveButton id={id} />}
			<Name id={id} index={index} />
			<div className='flex flex-col gap-4'>
				<div className='bg-[#F2F4FC] border border-[#D9D9D9] rounded-2xl p-5'>
					<Recurring id={id} />
				</div>
				<div className='bg-[#F2F4FC] border border-[#D9D9D9] rounded-2xl p-5'>
					<Conditions id={id} />
				</div>
			</div>
		</div>
	);
};

export default Model;
