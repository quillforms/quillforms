import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
	TextControl,
} from '@quillforms/admin-components';
import { __ } from '@wordpress/i18n';

import { usePaymentsContext } from '../state/context';

const Labels = () => {
	const { labels, setLabel } = usePaymentsContext();

	return (
		<div className="quillforms-payments-page-settings__labels">
			<div className=" grid grid-cols-2 gap-5">
				<div className="flex flex-col gap-2.5">
					<h3 className='!m-0 !text-[#334155] !text-2xl !font-medium'>{__('Labels', 'quillforms')}</h3>
					<p className=' text-lg text-[#777] leading-7'>
						{__(
							'This is where you shape the words your customers see during checkout—whether it’s the order details, the discount field, or the pay button—so every step feels clear, simple, and aligned with your brand’s voice.',
							'quillforms'
						)}
					</p>
				</div>
				<div className="quillforms-payments-page-settings__labels-fields grid grid-cols-2 gap-5">
					<BaseControl>
						<ControlWrapper orientation="vertical">
							<ControlLabel label={<span className='!m-0 !text-[#334155] !text-xl leading-7 whitespace-nowrap'>{__('Order details heading', 'quillforms')}</span>} />
							<TextControl
								value={labels.order_details_heading}
								onChange={(value) => {
									setLabel('order_details_heading', value);
								}}
							/>
						</ControlWrapper>
					</BaseControl>
					<BaseControl>
						<ControlWrapper orientation="vertical">
							<ControlLabel label={<span className='!m-0 !text-[#334155] !text-xl leading-7 whitespace-nowrap'>{__('Payment method selection', 'quillforms')}</span>} />
							<TextControl
								value={labels.select_payment_method}
								onChange={(value) => {
									setLabel('select_payment_method', value);
								}}
							/>
						</ControlWrapper>
					</BaseControl>
					<BaseControl>
						<ControlWrapper orientation="vertical">
							<ControlLabel label={<span className='!m-0 !text-[#334155] !text-xl leading-7 whitespace-nowrap'>{__('Order total', 'quillforms')}</span>} />
							<TextControl
								value={labels.order_total}
								onChange={(value) => {
									setLabel('order_total', value);
								}}
							/>
						</ControlWrapper>
					</BaseControl>
					<BaseControl>
						<ControlWrapper orientation="vertical">
							<ControlLabel label={<span className='!m-0 !text-[#334155] !text-xl leading-7 whitespace-nowrap'>{__('Pay button label', 'quillforms')}</span>} />
							<TextControl
								value={labels.pay}
								onChange={(value) => {
									setLabel('pay', value);
								}}
							/>
						</ControlWrapper>
					</BaseControl>
					<BaseControl>
						<ControlWrapper orientation="vertical">
							<ControlLabel label={<span className='!m-0 !text-[#334155] !text-xl leading-7 whitespace-nowrap'>{__('Discount question', 'quillforms')}</span>} />
							<TextControl
								value={labels.discountQuestion}
								onChange={(value) => {
									setLabel('discountQuestion', value);
								}}
							/>
						</ControlWrapper>
					</BaseControl>
					<BaseControl>
						<ControlWrapper orientation="vertical">
							<ControlLabel label={<span className='!m-0 !text-[#334155] !text-xl leading-7 whitespace-nowrap'>{__('Discount Placeholder', 'quillforms')}</span>} />
							<TextControl
								value={labels.discountPlaceholder}
								onChange={(value) => {
									setLabel('discountPlaceholder', value);
								}}
							/>
						</ControlWrapper>
					</BaseControl>
					<BaseControl>
						<ControlWrapper orientation="vertical">
							<ControlLabel label={<span className='!m-0 !text-[#334155] !text-xl leading-7 whitespace-nowrap'>{__('Apply Discount', 'quillforms')}</span>} />
							<TextControl
								value={labels.applyDiscount}
								onChange={(value) => {
									setLabel('applyDiscount', value);
								}}
							/>
						</ControlWrapper>
					</BaseControl>
				</div>
			</div>
		</div>
	);
};

export default Labels;
