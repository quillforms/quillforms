import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
	TextControl,
} from '@quillforms/admin-components';

import { usePaymentsContext } from '../state/context';

const Labels = () => {
	const { labels, updateLabel } = usePaymentsContext();
	return (
		<div className="quillforms-payments-page-settings__labels">
			<h3> Labels </h3>
			<div className="quillforms-payments-page-settings__labels-content">
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label="Order details heading"></ControlLabel>
						<TextControl
							value={
								labels?.order_details_heading ?? 'Order Details'
							}
							onChange={ ( val ) => {
								updateLabel( 'order_details_heading', val );
							} }
						></TextControl>
					</ControlWrapper>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label="Payment method selection"></ControlLabel>
						<TextControl
							value={
								labels?.select_payment_method ??
								'Select a payment method'
							}
							onChange={ ( val ) => {
								updateLabel( 'select_payment_method', val );
							} }
						></TextControl>
					</ControlWrapper>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label="Order total"></ControlLabel>
						<TextControl
							value={ labels?.order_total ?? 'Total' }
							onChange={ ( val ) => {
								updateLabel( 'order_total', val );
							} }
						></TextControl>
					</ControlWrapper>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label="Pay button label"></ControlLabel>
						<TextControl
							value={ labels?.pay ?? 'Pay Now' }
							onChange={ ( val ) => {
								updateLabel( 'pay', val );
							} }
						></TextControl>
					</ControlWrapper>
				</BaseControl>
			</div>
		</div>
	);
};

export default Labels;
