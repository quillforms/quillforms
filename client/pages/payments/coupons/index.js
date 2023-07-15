/**
 * QuillForms Dependencies
 */
import { BaseControl, ControlWrapper } from '@quillforms/admin-components';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import { usePaymentsContext } from '../state/context';
import AddButton from './add-button';
import Coupon from './coupon';

const Coupons = () => {
	const { coupons } = usePaymentsContext();

	return (
		<div className="quillforms-payments-page-settings__coupons">
			<h3> {__('Coupons', 'quillforms')} </h3>
			<div className="quillforms-payments-page-settings__products-content">
				<BaseControl>
					<ControlWrapper orientation="vertical">
						{Object.keys(coupons).map((id) => (
							<Coupon key={id} id={id} />
						))}
						<AddButton />
					</ControlWrapper>
				</BaseControl>
			</div>
		</div>
	);
};

export default Coupons;
