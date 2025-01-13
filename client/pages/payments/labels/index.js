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
			<h3>{__('Labels', 'quillforms')}</h3>
			<div className="quillforms-payments-page-settings__labels-content">
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label={__('Order details heading', 'quillforms')}></ControlLabel>
						<TextControl
							value={labels.order_details_heading}
							onChange={(value) => {
								setLabel('order_details_heading', value);
							}}
						></TextControl>
					</ControlWrapper>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label={__('Payment method selection', 'quillforms')}></ControlLabel>
						<TextControl
							value={labels.select_payment_method}
							onChange={(value) => {
								setLabel('select_payment_method', value);
							}}
						></TextControl>
					</ControlWrapper>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label={__('Order total', 'quillforms')}></ControlLabel>
						<TextControl
							value={labels.order_total}
							onChange={(value) => {
								setLabel('order_total', value);
							}}
						></TextControl>
					</ControlWrapper>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label={__('Pay button label', 'quillforms')}></ControlLabel>
						<TextControl
							value={labels.pay}
							onChange={(value) => {
								setLabel('pay', value);
							}}
						></TextControl>
					</ControlWrapper>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label={__('Discount question', 'quillforms')}></ControlLabel>
						<TextControl
							value={labels.discountQuestion}
							onChange={(value) => {
								setLabel('discountQuestion', value);
							}}
						></TextControl>
					</ControlWrapper>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label={__('Discount Placeholder', 'quillforms')}></ControlLabel>
						<TextControl
							value={labels.discountPlaceholder}
							onChange={(value) => {
								setLabel('discountPlaceholder', value);
							}}
						></TextControl>
					</ControlWrapper>

				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label={__('Apply Discount', 'quillforms')}></ControlLabel>
						<TextControl
							value={labels.applyDiscount}
							onChange={(value) => {
								setLabel('applyDiscount', value);
							}}
						></TextControl>
					</ControlWrapper>
				</BaseControl>

			</div>
		</div>
	);
};

export default Labels;
