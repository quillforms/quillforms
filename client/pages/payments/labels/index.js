import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
	TextControl,
} from '@quillforms/admin-components';

import { usePaymentsContext } from '../state/context';

const Labels = () => {
	const { labels, setLabel } = usePaymentsContext();

	return (
		<div className="quillforms-payments-page-settings__labels">
			<h3> Labels </h3>
			<div className="quillforms-payments-page-settings__labels-content">
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label="Order details heading"></ControlLabel>
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
						<ControlLabel label="Payment method selection"></ControlLabel>
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
						<ControlLabel label="Order total"></ControlLabel>
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
						<ControlLabel label="Pay button label"></ControlLabel>
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
						<ControlLabel label="Discount question"></ControlLabel>
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
						<ControlLabel label="Discount Placeholder"></ControlLabel>
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
						<ControlLabel label="Apply Discount"></ControlLabel>
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
