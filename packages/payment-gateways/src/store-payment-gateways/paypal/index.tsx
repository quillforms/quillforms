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
import Settings from '../settings';

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
	const assetsDir = ConfigAPI.getPluginDirUrl() + 'assets/addons/paypal';

	registerPaymentGatewayModule( 'paypal', {
		name: 'PayPal',
		description: 'Accept payments through paypal gateway.',
		icon: `${ assetsDir }/icon.png`,
		active: false,
		settings: Settings,
		isPro: true,
		methods: {
			checkout: {
				isRecurringSupported: true,
				admin: {
					label: {
						icon: `${ assetsDir }/pp-logo-200px.webp`,
						text: 'Checkout',
					},
				},
				customer: {
					label: {
						text: 'Checkout !!!!',
					},
					render: CustomerRender,
				},
			},
			card: {
				isRecurringSupported: false,
				admin: {
					label: {
						icon: `${ assetsDir }/pp-logo-200px.webp`,
						text: 'Card',
					},
				},
				customer: {
					label: {
						text: 'Card !!!!',
					},
					render: CustomerRender,
				},
			},
		},
	} );
}
