/**
 * QuillForms Dependencies.
 */
import ConfigAPI from '@quillforms/config';

/**
 * Internal Dependencies.
 */
import { registerPaymentGatewayModule } from '../../api';
import CustomerRender from './customer-render';
import MethodOptions from './method-options';
import SettingsRender from './settings-render';

const iconPath =
	ConfigAPI.getPluginDirUrl() + 'assets/payments/banktransfer/icon.jpg';

registerPaymentGatewayModule( 'banktransfer', {
	name: 'Bank Transfer',
	description: 'Take payments in person via direct bank transfer.',
	icon: iconPath,
	active: true,
	settings: SettingsRender,
	methods: {
		default: {
			isRecurringSupported: false,
			isCustomerRequired: {
				onetime: true,
				recurring: true,
			},
			admin: {
				label: {
					icon: iconPath,
					text: 'Bank Transfer',
				},
				options: MethodOptions,
			},
			customer: {
				label: {
					text: 'Bank Transfer',
				},
				render: CustomerRender,
			},
		},
	},
} );
