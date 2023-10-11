/**
 * QuillForms Dependencies.
 */
import { getPaymentGatewayModules } from '@quillforms/payment-gateways';
import ConfigApi from '@quillforms/config';
import { __experimentalAddonFeatureAvailability } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useEffect, useState } from "@wordpress/element";
import { Panel, PanelBody } from '@wordpress/components';
import { Icon as IconComponent } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import './style.scss';

const Payments = () => {
	const [isLoading, setIsloading] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setIsloading(true);
		}, 500);
	})
	const gateways = getPaymentGatewayModules();

	return (
		<div className="quillforms-settings-payments-tab">
			<Panel>
				{Object.entries(gateways).map(([slug, gateway]) => {
					const icon = gateway.icon.mini;
					const header = (
						<div className="quillforms-settings-payments-tab-addon-header">
							{typeof icon === 'string' ? (
								<img src={icon} />
							) : (
								<IconComponent
									icon={icon?.src ? icon.src : icon}
								/>
							)}
							<div>{gateway.name}</div>
						</div>
					);
					const addon = ConfigApi.getStoreAddons()[slug];
					return (
						<PanelBody
							key={slug}
							title={header}
							initialOpen={false}
							className="quillforms-settings-payments-tab-addon"
						>
							{!gateway.settings ? (
								<__experimentalAddonFeatureAvailability
									featureName={
										addon.name + ' Payment Gateway'
									}
									addonSlug={slug}
									showLockIcon={true}
								/>
							) : (
								<div className="quillforms-settings-payments-tab-addon-body">
									<gateway.settings slug={slug} />
								</div>
							)}
						</PanelBody>
					);
				})}
			</Panel>
		</div>
	);
};

export default Payments;
