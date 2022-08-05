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
	const assetsDir = ConfigAPI.getPluginDirUrl() + 'assets/addons/stripe';

	registerPaymentGatewayModule( 'stripe', {
		name: 'Stripe',
		description: 'Accept payments through stripe gateway.',
		icon: {
			mini: `${ assetsDir }/icon.png`,
			full: `${ assetsDir }/icon-full.svg`,
		},
		active: false,
		methods: {
			elements: {
				configured: false,
				isRecurringSupported: true,
				admin: {
					label: {
						icon: `${ assetsDir }/icon-full.svg`,
						text: 'Elements',
					},
				},
				customer: {
					label: {
						text: 'Elements !!!!',
					},
					render: CustomerRender,
				},
			},
			checkout: {
				configured: false,
				isRecurringSupported: true,
				admin: {
					label: {
						icon: `${ assetsDir }/icon-full.svg`,
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
		},
	} );
}
