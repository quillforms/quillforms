/**
 * QuillForms Dependencies
 */
import { getPaymentGatewayModules } from '@quillforms/payment-gateways';
import Button from '../../button';
import configApi from '@quillforms/config';

/**
 * WordPress Dependencies
 */
import RadioControl from './radio-control';
import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import useGeneralTheme from '../../../hooks/use-general-theme';

/**
 * External Dependencies
 */
import { css } from 'emotion';
import { size } from 'lodash';
import classnames from 'classnames';
import { TailSpin as Loader } from 'react-loader-spinner';

interface Props {
	data: any;
}

const Methods: React.FC<Props> = ({ data }) => {
	const { setPaymentData, completeForm } = useDispatch(
		'quillForms/renderer-core'
	);
	const generalTheme = useGeneralTheme();

	const gateways = getPaymentGatewayModules();
	const methodsKeys = Object.keys(data.payments.methods);

	const options = methodsKeys.map((key) => {
		const [gateway, method] = key.split(':');
		return {
			label: gateways[gateway].methods[method].customer.label.text,
			value: key,
		};
	});

	const urlParams = new URLSearchParams(window.location.search);
	let defaultMethod = methodsKeys[0];
	if (
		urlParams.get('step') === 'payment' &&
		methodsKeys.includes(urlParams.get('method') ?? '')
	) {
		defaultMethod = urlParams.get('method') ?? '';
	}

	const [selected, setSelected] = useState(defaultMethod);
	const [gateway, method] = selected.split(':');

	const CustomerRender =
		gateways[gateway].methods[method].customer.render;
	const discountDetails = data.payments?.discount_details;
	const discountAmount = discountDetails?.amount;
	const [isPaying, setIsPaying] = useState(false);
	const completeFullDiscountedOrders = async () => {
		if (isPaying) return;
		setIsPaying(true);
		try {
			const { submission_id, hashed_id } = data;
			let response = await fetch(
				configApi.getAdminUrl() + 'admin-ajax.php',
				{
					method: 'POST',
					body: new URLSearchParams({
						action: 'quillforms_complete_full_discounted_orders',
						submissionId: submission_id,
						hashedId: hashed_id,
					}),
				}
			);

			let result = await response.json();
			if (result.success) {
				completeForm();
			} else {
				throw new Error(result.message);
			}
		} catch (e) {
			//console.log('completePendingSubmission: error throwed', e);
			return {
				success: false,
				message:
					e instanceof Error && e.message
						? e.message
						: 'Unexpected error',
			};
		}

		setIsPaying(false);
	};

	return (
		<div className="renderer-core-payment-modal-methods">
			<>
				{size(methodsKeys) > 1 && (
					<>
						<p
							className={css`
								color: ${generalTheme.questionsColor};
								font-size: 20px;
							` }
						>
							{data.payments.labels?.select_payment_method ??
								'Select a payment method'}
						</p>
						<div className="renderer-components-radio-control__options-group">
							<RadioControl
								id="payment-methods"
								selected={selected}
								options={options}
								onChange={setSelected}
							/>
						</div>
					</>
				)}
			</>
			{discountAmount !== 0 && (
				<CustomerRender
					slug={selected}
					data={data}
					onComplete={() => {
						completeForm();
						setPaymentData(null);
					}}
				/>
			)}
			{discountAmount === 0 && (
				<div>
					<Button
						className={classnames(
							{
								loading: isPaying,
							},
							css`
								&.loading .renderer-core-arrow-icon {
									display: none;
								}
							`,
							'payment-button'
						)}
						onClick={() => {
							completeFullDiscountedOrders();
						}}
					>
						<span id="button-text">
							{isPaying ? (
								<Loader
									color={generalTheme.buttonsFontColor}
									height={50}
									width={50}
								/>
							) : (
								<>
									{data?.payments?.labels?.pay ??
										__('Pay now', 'quillforms')}
								</>
							)}
						</span>
					</Button>
				</div>
			)}
		</div>
	);
};

export default Methods;
