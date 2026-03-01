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
			<div className=' flex justify-between items-center '>
				<div className=' flex flex-col gap-3'>
					<h3 className='!m-0 !text-[#334155] !text-2xl !font-medium'> Payment Model(s) </h3>
					<p className=" text-lg text-[#777] leading-7 font-medium">
						The price of the model is the total price of products
					</p>
				</div>
				<AddModel />
			</div>
			<div className="quillforms-payments-page-settings__models-content my-5">
				{Object.keys(models).map((id, index) => (
					<Model key={id} id={id} index={index + 1} />
				))}
			</div>
		</div>
	);
};

export default Models;
