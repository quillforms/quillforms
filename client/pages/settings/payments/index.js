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
	const gateways = getPaymentGatewayModules();

	return (
		<div className="quillforms-settings-payments-tab">
			<Panel>
				{ Object.entries( gateways ).map( ( [ slug, gateway ] ) => {
					const icon = gateway.icon.mini;
					const header = (
						<div className="quillforms-settings-payments-tab-addon-header">
							{ typeof icon === 'string' ? (
								<img src={ icon } />
							) : (
								<IconComponent
									icon={ icon?.src ? icon.src : icon }
								/>
							) }
							<div>{ gateway.name }</div>
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
								<gateway.settings slug={ slug } />
							</div>
						</PanelBody>
					);
				} ) }
			</Panel>
		</div>
	);
};

export default Payments;
