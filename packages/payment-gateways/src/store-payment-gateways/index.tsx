/**
 * QuillForms Dependencies.
 */
import ConfigAPI from '@quillforms/config';

/**
 * Internal Dependencies.
 */
import { registerPaymentGatewayModule } from '../api';
import Render from './options-render';
import SettingsRender from './settings-render';

for ( const [ slug, addon ] of Object.entries( ConfigAPI.getStoreAddons() ) ) {
	if ( addon.is_payment_gateway ) {
		registerPaymentGatewayModule( slug, {
			title: addon.name,
			description: addon.description,
			icon: addon.assets.icon,
			optionsRender: Render,
			settingsRender: SettingsRender,
			active: false,
		} );
	}
}
