/**
 * QuillForms Dependencies.
 */
import { getPaymentGatewayModules } from '@quillforms/payment-gateways';

/**
 * WordPress Dependencies
 */
import { Panel, PanelBody } from '@wordpress/components';
import { Icon as IconComponent } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import './style.scss';

const Payments = () => {
	const paymentGatewayModules = getPaymentGatewayModules();

	return (
		<div className="quillforms-settings-payments-tab">
			<Panel>
				{ Object.entries( paymentGatewayModules ).map(
					( [ slug, paymentGateway ] ) => {
						const icon = paymentGateway.icon;
						const header = (
							<div className="quillforms-settings-payments-tab-addon-header">
								{ typeof icon === 'string' ? (
									<img src={ icon } />
								) : (
									<IconComponent
										icon={ icon?.src ? icon.src : icon }
									/>
								) }
								<div>{ paymentGateway.name }</div>
							</div>
						);
						return (
							<PanelBody
								key={ slug }
								title={ header }
								initialOpen={ false }
								className="quillforms-settings-payments-tab-addon"
							>
								<div className="quillforms-settings-payments-tab-addon-body">
									<paymentGateway.settingsRender
										slug={ slug }
									/>
								</div>
							</PanelBody>
						);
					}
				) }
			</Panel>
		</div>
	);
};

export default Payments;
