/**
 * QuillForms Dependencies.
 */
import ConfigAPI from '@quillforms/config';

/**
 * Internal Dependencies.
 */
import { registerPaymentGatewayModule } from '../../api';
import optionsRender from './options-render';
import SettingsRender from './settings-render';

registerPaymentGatewayModule( 'banktransfer', {
	title: 'Bank Transfer',
	description: 'Take payments in person via direct bank transfer.',
	icon: ConfigAPI.getPluginDirUrl() + 'assets/payments/banktransfer/icon.jpg',
	optionsRender: optionsRender,
	settingsRender: SettingsRender,
	active: true,
} );
