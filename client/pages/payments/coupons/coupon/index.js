/**
 * QuillForms Dependencies.
 */
import { TextControl, SelectControl, ControlLabel } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import { usePaymentsContext } from '../../state/context';
import DeleteButton from '../delete-button';
import ArrowButtomIcon from '../../../../components/icon/arrow-buttom-icon';
import ArrowRightIcon from '../../../../components/icon/arrow-right-icon';

const Coupon = ({ id, initialOpen = false }) => {
	const { coupons, updateCoupon } = usePaymentsContext();

	const coupon = coupons[id];
	const discountTypOptions = [
		{
			name: __('Percentage (%)', 'quillforms'),
			key: 'percent',
		},
		{
			name: __('Fixed Amount ($)', 'quillforms'),
			key: 'fixed',
		},
	];

	const [isOpen, setIsOpen] = useState(initialOpen);

	useEffect(() => {
		if (coupon.discount_type === 'percentage') {
			updateCoupon(id, { discount_type: 'percent' });
		}
	}, []);

	return (
		<div >
			<div className="qf-payments-coupon-card rounded-2xl p-5">
				<button
					type="button"
					className="qf-payments-coupon-header"
					onClick={() => setIsOpen((prev) => !prev)}
				>
					<div className="qf-payments-coupon-title">
						<span className="!m-0 !text-[#334155] !text-base !font-medium">
							{coupon.name || __('New Coupon', 'quillforms')}
						</span>
					</div>
					<div className="qf-payments-coupon-header-actions">
						<DeleteButton id={id} />
						{isOpen ? (
							<ArrowButtomIcon width={20} height={20} />
						) : (
							<ArrowRightIcon width={20} height={20} />
						)}
					</div>
				</button>
				{isOpen && (
					<>
					<div className="border-b border-border-color mt-6"></div>
					<div className="qf-payments-coupon-body pt-6">
						<div className="qf-payments-coupon-grid">
							<div className="qf-payments-coupon-grid__field">
								<ControlLabel
									label={<span className="!m-0 !text-[#334155] !text-lg !font-medium">{__('Coupon Name', 'quillforms')}</span>}
									showAsterisk={true}
								/>
								<TextControl
									value={coupon.name}
									onChange={(name) => updateCoupon(id, { name })}
									placeholder={__('10% off', 'quillforms')}
									help={<span className="!m-0 !text-[#777] !text-base leading-[26px] !font-normal">{__('Enter a name for the coupon here. This is for internal reference only.', 'quillforms')}</span>}
									className="coupon__field__required"
								/>
							</div>
							<div className="qf-payments-coupon-grid__field">
								<ControlLabel
									label={<span className="!m-0 !text-[#334155] !text-lg !font-medium">{__('Coupon Code', 'quillforms')}</span>}
									showAsterisk={true}
								/>
								<TextControl
									value={coupon.code}
									onChange={(code) => updateCoupon(id, { code })}
									placeholder={__('10OFF', 'quillforms')}
									help={<span className="!m-0 !text-[#777] !text-base leading-[26px] !font-normal">{__('Enter the code customers will enter to apply the coupon.', 'quillforms')}</span>}
									className="coupon__field__required"
								/>
							</div>
							<div className="qf-payments-coupon-grid__field qf-payments-coupon-grid__field--full">
								<div className="coupon__discount">
									<ControlLabel
										label={<span className="!m-0 !text-[#334155] !text-lg !font-medium">{__('Discount', 'quillforms')}</span>}
										showAsterisk={true}
									/>
									<div className="coupon__discount__fields">
										<SelectControl
											value={discountTypOptions.find(
												(option) => option.key === coupon.discount_type
											)}
											onChange={({ selectedItem }) => {
												if (selectedItem) {
													const { key } = selectedItem;
													updateCoupon(id, { discount_type: key })
												}

											}}
											options={discountTypOptions}
										/>
										<TextControl
											value={coupon.discount_amount}
											onChange={(discount_amount) =>
												updateCoupon(id, { discount_amount })
											}
											placeholder={__('10', 'quillforms')}
										/>
									</div>
								</div>
							</div>
							<div className="qf-payments-coupon-grid__field">
								<TextControl
									label={<span className="!m-0 !text-[#334155] !text-lg !font-medium">{__('Start Date', 'quillforms')}</span>}
									value={coupon.start_date}
									onChange={(start_date) => updateCoupon(id, { start_date })}
									type="date"
								/>
							</div>
							<div className="qf-payments-coupon-grid__field">
								<TextControl
									label={<span className="!m-0 !text-[#334155] !text-lg !font-medium">{__('End Date', 'quillforms')}</span>}
									value={coupon.end_date}
									onChange={(end_date) => updateCoupon(id, { end_date })}
									type="date"
								/>
							</div>
							<div className="qf-payments-coupon-grid__field qf-payments-coupon-grid__field--full">
								<TextControl
									label={<span className="!m-0 !text-[#334155] !text-lg !font-medium">{__('Usage Limit', 'quillforms')}</span>}
									value={coupon.usage_limit}
									onChange={(usage_limit) => updateCoupon(id, { usage_limit })}
									type="number"
									help={__('How many times the coupon can be used before it is void.', 'quillforms')}
								/>
							</div>
						</div>
					</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Coupon;
