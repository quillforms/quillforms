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
	const assetsDir = ConfigAPI.getPluginDirUrl() + 'assets/addons/2checkout';

	registerPaymentGatewayModule( 'tco', {
		name: '2Checkout',
		description: 'Accept payments through 2checkout gateway.',
		icon: {
			mini: `${ assetsDir }/icon.png`,
			full: `${ assetsDir }/icon-full.png`,
		},
		active: false,
		methods: {
			card: {
				configured: false,
				isRecurringSupported: true,
				admin: {
					label: {
						icon: `${ assetsDir }/icon-full.png`,
						text: 'Checkout',
					},
				},
				customer: {
					label: {
						text: '2Checkout Checkout',
					},
					render: CustomerRender,
				},
			},
		},
	} );
}
