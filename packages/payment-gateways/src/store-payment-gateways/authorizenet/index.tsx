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
import { registerPaymentGatewayModule } from '../../api';
import CustomerRender from '../customer-render';

addAction(
	'QuillForms.Admin.PluginsLoaded',
	'QuillForms/PaymentGateways/RegisterStoreModules',
	register
);
addAction(
	'QuillForms.RendererCore.Loaded',
	'QuillForms/PaymentGateways/RegisterStoreModules',
	register
);

function register() {
	const assetsDir =
		ConfigAPI.getPluginDirUrl() + 'assets/addons/authorizenet';

	registerPaymentGatewayModule( 'authorizenet', {
		name: 'Authorize.net',
		description: 'Accept payments through authorize.net gateway.',
		icon: {
			mini: `${ assetsDir }/icon.png`,
			full: `${ assetsDir }/icon-full.svg`,
		},
		active: false,
		methods: {
			card: {
				configured: false,
				isRecurringSupported: true,
				admin: {
					label: {
						icon: `${ assetsDir }/icon-full.svg`,
						text: 'Card',
					},
				},
				customer: {
					label: {
						text: 'Authorize.Net Card',
					},
					render: CustomerRender,
				},
			},
		},
	} );
}
