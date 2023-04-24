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
	const assetsDir = ConfigAPI.getPluginDirUrl() + 'assets/addons/razorpay';

	registerPaymentGatewayModule( 'razorpay', {
		name: 'Razorpay',
		description: 'Accept payments through razorpay gateway.',
		icon: {
			mini: `${ assetsDir }/icon.png`,
			full: `${ assetsDir }/icon-full.svg`,
		},
		active: false,
		methods: {
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
						text: 'Razorpay Checkout',
					},
					render: CustomerRender,
				},
			},
		},
	} );
}
