/**
 * QuillForms Dependencies.
 */
import ConfigAPI from '@quillforms/config';

/**
 * Internal Dependencies.
 */
import { registerPaymentGatewayModule } from '../../api';
import ClientRender from './client-render';
import OptionsRender from './options-render';
import SettingsRender from './settings-render';

registerPaymentGatewayModule( 'banktransfer', {
	name: 'Bank Transfer',
	description: 'Take payments in person via direct bank transfer.',
	icon: ConfigAPI.getPluginDirUrl() + 'assets/payments/banktransfer/icon.jpg',
	active: true,
	settingsRender: SettingsRender,
	methods: {
		default: {
			name: 'Bank Transfer',
			optionsRender: OptionsRender,
			clientRender: ClientRender,
		},
	},
} );
