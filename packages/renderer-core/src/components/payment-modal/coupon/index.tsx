/**
 * QuillForms Dependencies
 */
import useGeneralTheme from '../../../hooks/use-general-theme';
import configApi from '@quillforms/config';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import classnames from 'classnames';
import { TailSpin as Loader } from 'react-loader-spinner';
import { css } from 'emotion';

interface Props {
	data: any;
}

const Coupon: React.FC<Props> = ({ data }) => {
	const generalTheme = useGeneralTheme();
	const [isPaying, setIsPaying] = useState(false);
	const [showCoupon, setShowCoupon] = useState(false);
	const [coupon, setCoupon] = useState('');
	const [error, setError] = useState('');
	const { setPaymentData } = useDispatch('quillForms/renderer-core');

	// @ts-ignore applyCoupon is a property of applyCoupon.
	const applyCoupon = async () => {
		setError('');
		setIsPaying(true);
		try {
			const { submission_id, hashed_id } = data;
			let response = await fetch(
				configApi.getAdminUrl() + 'admin-ajax.php',
				{
					method: 'POST',
					body: new URLSearchParams({
						action: 'quillforms_apply_discount',
						submissionId: submission_id,
						hashedId: hashed_id,
						coupon,
					}),
				}
			);

			let result = await response.json();
			if (result.success) {
				// Update new products
				const UpdatedData = { ...data };
				UpdatedData.payments.discount_details = result.data.details;
				UpdatedData.payments.discount_details['coupon'] = coupon;
				setPaymentData(UpdatedData);
			} else {
				setError(result.data);
			}
		} catch (e) {
			//console.log('applyCoupon: error throwed', e);
			return {
				success: false,
				message:
					e instanceof Error && e.message
						? e.message
						: 'Unexpected error',
			};
		}

		setIsPaying(false);
		setCoupon('');
	};
	return (
		<div className="renderer-core-payment-coupon">
			<div
				className={classnames("renderer-core-payment-coupon__label", css`
					color: ${generalTheme.questionsColor};
				`)}
				onClick={() => setShowCoupon(true)}
			>
				{data.payments.labels?.discountQuestion ?? 'You have a coupon?'}
			</div>
			{showCoupon && (
				<div className="render-core-payment-coupon-form">
					<div className="renderer-core-payment-coupon__input">
						<input
							type="text"
							placeholder={data.payments.labels?.discountPlaceholde ?? 'Enter your discount code'}
							style={{
								color: '#333',
								border: `1px solid rgba(0, 0, 0, 0.3)`,
								borderRadius: '8px',
								fontSize: '16px',
								padding: '10px 20px',
								lineHeight: '1',
								background: "#fff"

							}}
							className={classnames(
								css`
									&:focus {
										outline: none;
										border: 1px solid rgba( 0, 0, 0, 0.3 );
									}
								`
							)}
							value={coupon}
							onChange={(e) => setCoupon(e.target.value)}
						/>
					</div>
					<div className="renderer-core-payment-coupon__apply">
						<button
							className={classnames(
								{
									loading: isPaying,
								},
								css`
									border-radius: 8px;
									background: ${generalTheme.buttonsBgColor};
									color: ${generalTheme.buttonsFontColor};
									border: none;
									padding: 10px 20px;
									font-size: 16px;
									cursor: pointer;
									&.loading .renderer-core-arrow-icon {
										display: none;
									}
								`,
								'apply-coupon-button'
							)}
							onClick={() => applyCoupon()}
						>
							<span id="button-text">
								{isPaying ? (
									<Loader
										color={generalTheme.buttonsFontColor}
										height={16}
										width={16}
									/>
								) : (
									<>{data.payments.labels?.applyDiscount ?? 'apply'} </>
								)}
							</span>
						</button>
					</div>
				</div>
			)}
			{error && (
				<div
					className={classnames(
						'renderer-core-payment-coupon__error',
						css`
							color: #a94442;
							font-size: 14px;
							margin-top: 10px;
						`
					)}
				>
					{error}
				</div>
			)}
		</div>
	);
};

export default Coupon;
