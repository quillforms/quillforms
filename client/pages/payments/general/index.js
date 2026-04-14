/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
	ToggleControl,
} from '@quillforms/admin-components';

/**
 * Internal Dependencies
 */
import { usePaymentsContext } from '../state/context';
import Currency from './currency';
import { __ } from '@wordpress/i18n';
const General = () => {
	const { general, updateGeneral } = usePaymentsContext();

	return (
		<div className="quillforms-payments-page-settings__general">
			<div className=" grid grid-cols-1 md:grid-cols-2 gap-5">
				<div className="flex flex-col gap-2.5">
					<h3 className='!m-0 !text-[#334155] !text-2xl !font-medium'>{__('General Settings', 'quillforms')}</h3>
					<p className=' text-lg text-[#777] leading-7'>
						{__(
							'Set up payments in a way that feels simple and flexible. Choose your currency, adjust the format, and keep everything clear for your customers.',
							'quillforms'
						)}
					</p>
				</div>
				<div className="quillforms-payments-page-settings__general-header-toggle flex flex-col gap-5">
					<BaseControl>
						<ControlWrapper orientation="horizontal">
							<ControlLabel
								label={
									<span className='!m-0 !text-[#334155] !text-xl !p-0 leading-7'>
										{__('Enable Payments', 'quillforms')}
									</span>
								}
							/>
							<ToggleControl
								checked={general.enabled}
								onChange={() =>
									updateGeneral({
										enabled: !general.enabled,
									})
								}
							/>
						</ControlWrapper>
					</BaseControl>
					<Currency />
				</div>
			</div>
		</div>
	);
};

export default General;
