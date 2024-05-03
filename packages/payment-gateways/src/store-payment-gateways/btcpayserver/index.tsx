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
		ConfigAPI.getPluginDirUrl() + 'assets/addons/btcpayserver';

	registerPaymentGatewayModule( 'btcpayserver', {
		name: 'BTCPayServer',
		description: 'Accept payments through BTCPayServer gateway.',
		icon: {
			mini: `${ assetsDir }/icon.svg`,
			full: `${ assetsDir }/icon.svg`,
		},
		active: false,
		methods: {
			checkout: {
				configured: false,
				isRecurringSupported: false,
				admin: {
					label: {
						icon: `${ assetsDir }/icon-full.svg`,
						text: 'Checkout',
					},
					//@ts-ignore
					// hint,
				},
				customer: {
					label: {
						text: 'BTCPayServer Checkout',
					},
					render: CustomerRender,
				},
			},
		},
	} );
}
