/**
 * QuillForms Dependencies.
 */
import ConfigAPI from '@quillforms/config';

/**
 * WordPress Dependencies.
 */
import { addAction } from '@wordpress/hooks';

/**
 * Internal Dependencies.
 */
import { registerPaymentGatewayModule } from '../api';
import ClientRender from './client-render';
import OptionsRender from './options-render';
import SettingsRender from './settings-render';

addAction(
	'QuillForms.Admin.PluginsLoaded',
	'QuillForms/PaymentGateways/RegisterStoreModules',
	register
);
addAction(
	'QuillForms.Renderer.Loaded',
	'QuillForms/PaymentGateways/RegisterStoreModules',
	register
);

function register() {
	for ( const [ slug, addon ] of Object.entries(
		ConfigAPI.getStoreAddons()
	) ) {
		if ( addon.is_payment_gateway ) {
			const methods = {};
			for ( const [ key, data ] of Object.entries< { name: string } >(
				addon.additional.methods
			) ) {
				methods[ key ] = {
					...data,
					optionsRender: OptionsRender,
					clientRender: ClientRender,
				};
			}
			registerPaymentGatewayModule( slug, {
				name: addon.name,
				description: addon.description,
				icon: addon.assets.icon,
				active: false,
				settingsRender: SettingsRender,
				methods,
			} );
		}
	}
}
