/**
 * QuillForms Dependencies
 */
import { BaseControl, ControlWrapper } from '@quillforms/admin-components';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { Panel } from '@wordpress/components';

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
			<div className="quillforms-payments-page-settings__coupons-content">
				<BaseControl>
					<ControlWrapper orientation="vertical">
						{Object.keys(coupons).length > 0 && (
							<Panel>
								{Object.keys(coupons).map((id) => (
									<Coupon key={id} id={id} />
								))}
							</Panel>
						)}
						<AddButton />
					</ControlWrapper>
				</BaseControl>
			</div>
		</div>
	);
};

export default Coupons;
