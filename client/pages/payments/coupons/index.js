/**
 * QuillForms Dependencies
 */
import { BaseControl, ControlWrapper } from '@quillforms/admin-components';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { Panel } from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { usePaymentsContext } from '../state/context';
import Coupon from './coupon';
import { getCouponDefaultState, randomId } from '../utils';
import AddIcon from '../../../components/icon/add-icon';

/**
 * External Dependencies
 */
import { keys, size } from 'lodash';
import EmptyIcon from '../../../components/icon/empty-icon';

const Coupons = () => {
	const { coupons, addCoupon } = usePaymentsContext();
	const hasCoupons = size(keys(coupons)) > 0;
	const [lastAddedId, setLastAddedId] = useState(null);

	const onAdd = () => {
		const id = randomId();
		addCoupon(id, getCouponDefaultState());
		setLastAddedId(id);
	};

	return (
		<div className="quillforms-payments-page-settings__coupons">
				<div className="qf-payments-coupons-header">
					<h3 className="!m-0 !text-[#334155] !text-2xl !font-medium">
						{__('Discount Coupons', 'quillforms')}
					</h3>
					<button
						type="button"
						className="qf-payments-coupons-add"
						onClick={onAdd}
					>
						<AddIcon/> {__('Add Coupon', 'quillforms')}
					</button>
				</div>

				{hasCoupons ? (
					<div className="">
						<BaseControl>
							<ControlWrapper orientation="vertical">
								{[...Object.keys(coupons)].reverse().map((id) => (
									<Coupon
										key={id}
										id={id}
										initialOpen={id === lastAddedId}
									/>
								))}
							</ControlWrapper>
						</BaseControl>
					</div>
				) : (
					<div className="qf-payments-coupons-empty">
						<EmptyIcon/>
						<p>
							{__(
								"Nothing here for now—Once you add new discount coupon, it'll appear here.",
								'quillforms'
							)}
						</p>
					</div>
				)}
		</div>
	);
};

export default Coupons;
