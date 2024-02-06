/**
 * QuillForms Dependencies
 */
import { formatMoney } from '@quillforms/utils';
import useGeneralTheme from '../../../hooks/use-general-theme';
import configApi from '@quillforms/config';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';

/**
 * External Dependencies
 */
import { css } from 'emotion';
import classnames from 'classnames';
import tinycolor from 'tinycolor2';
import { TailSpin as Loader } from 'react-loader-spinner';

/**
 * Internal Dependencies
 */
interface Props {
	data: any;
}

const Info: React.FC<Props> = ({ data }) => {
	const generalTheme = useGeneralTheme();
	const questionsColor = tinycolor(generalTheme.questionsColor);
	const cs = data.payments.currency.symbol;
	const csp = data.payments.currency.symbol_pos;
	const total = data.payments?.discount_details
		? data.payments.discount_details.amount
		: data.payments.products.total;
	const { setPaymentData } = useDispatch('quillForms/renderer-core');
	const [isDeleting, setIsDeleting] = useState(false);

	const deleteCoupon = async () => {
		setIsDeleting(true);
		try {
			const { submission_id, hashed_id } = data;
			let response = await fetch(
				configApi.getAdminUrl() + 'admin-ajax.php',
				{
					method: 'POST',
					body: new URLSearchParams({
						action: 'quillforms_delete_coupon',
						submissionId: submission_id,
						hashedId: hashed_id,
						coupon: data.payments.discount_details.coupon,
					}),
				}
			);

			let result = await response.json();
			if (result.success) {
				// Update new products
				const UpdatedData = { ...data };
				delete UpdatedData.payments.discount_details;
				setPaymentData(UpdatedData);
			}
		} catch (e) {
			console.log('deleteCoupon: error throwed', e);
			return {
				success: false,
				message:
					e instanceof Error && e.message
						? e.message
						: 'Unexpected error',
			};
		}
		setIsDeleting(false);
	};

	return (
		<div className="renderer-core-payment-modal-info">
			<div
				className={classnames(
					'renderer-core-payment-modal-info__heading',
					css`
						font-size: 22px;
						text-transform: uppercase;
						background: ${generalTheme.buttonsBgColor};
						padding: 15px;
						color: ${generalTheme.buttonsFontColor};
						border-top-right-radius: 8px;
						border-top-left-radius: 8px;
					`
				)}
			>
				{data.payments.labels?.order_details_heading ?? 'Your Order'}
			</div>
			{data.payments.products.items.map((item, index) => {
				if (item.price) {
					return (
						<div
							key={index}
							className={classnames(
								'renderer-core-payment-order__item-row',
								css`
									color: ${generalTheme.questionsColor};
									border-bottom: 1px solid;
									border-color: ${questionsColor
										.setAlpha(0.3)
										.toString()};
								`
							)}
						>
							<div className="renderer-core-payment-order__item-name">
								{item.name}
							</div>
							<div className="renderer-core-payment-order__item-price">
								{formatMoney(item.price, cs, csp)}{' '}
							</div>
						</div>
					);
				}
				else {
					return <></>
				}
			})}
			{data.payments?.discount_details && (
				<div
					className={classnames(
						'renderer-core-payment-modal-info_discount',
						css`
							color: ${generalTheme.questionsColor};
							border-bottom: 1px solid;
							border-color: ${questionsColor
								.setAlpha(0.3)
								.toString()};
							font-weight: bold;
						`
					)}
				>
					<div>{__('Discount', 'quillforms')} </div>
					<div
						className={classnames(
							'renderer-core-payment-modal-info_discount__details',
							css`
								display: inline-flex;
								align-items: center;
							`
						)}
					>
						<span className="renderer-core-payment-modal-info_discount__code">
							{data.payments.discount_details.code}
						</span>
						<span style={{ margin: '0 5px' }}>-</span>
						{formatMoney(
							data.payments.discount_details.discount,
							cs,
							csp
						)}
						{data.payments.discount_details.type === 'percent' && (
							<span
								className="renderer-core-payment-modal-info_discount__type"
								style={{ marginLeft: '5px' }}
							>
								{`(${data.payments.discount_details.discount_amount}%)`}
							</span>
						)}
						<div
							className={classnames(
								'renderer-core-payment-modal-info_delete-discount',
								css`
									display: inline-block;
									margin-left: 10px;
									color: #a94442;
									&:hover {
										cursor: pointer;
									}
								`
							)}
							onClick={deleteCoupon}
						>
							{isDeleting ? (
								<Loader
									color={'#a94442'}
									height={20}
									width={20}
								/>
							) : (
								<svg
									fill="currentColor"
									height="20"
									width="20"
									viewBox="0 0 1536 1792"
								>
									<path d="M1149 1122q0-26-19-45l-181-181 181-181q19-19 19-45 0-27-19-46l-90-90q-19-19-46-19-26 0-45 19l-181 181-181-181q-19-19-45-19-27 0-46 19l-90 90q-19 19-19 46 0 26 19 45l181 181-181 181q-19 19-19 45 0 27 19 46l90 90q19 19 46 19 26 0 45-19l181-181 181 181q19 19 45 19 27 0 46-19l90-90q19-19 19-46zM1536 896q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"></path>
								</svg>
							)}
						</div>
					</div>
				</div>
			)}
			<div
				className={classnames(
					'renderer-core-payment-modal-info_footer',
					css`
						color: ${generalTheme.questionsColor};
						font-weight: bold;
					`
				)}
			>
				<div>{data.payments.labels?.order_total ?? 'Total'} </div>
				<div>
					{formatMoney(total, cs, csp)}{' '}
					{data.payments.recurring &&
						` /${data.payments.recurring.interval_count} ${data.payments.recurring.interval_unit}/s`}
				</div>
			</div>
		</div>
	);
};

export default Info;
