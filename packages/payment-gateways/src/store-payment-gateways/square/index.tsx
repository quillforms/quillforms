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
	const assetsDir = ConfigAPI.getPluginDirUrl() + 'assets/addons/square';

	registerPaymentGatewayModule( 'square', {
		name: 'Square',
		description: 'Accept payments through square gateway.',
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
						text: 'Square Card',
					},
					render: CustomerRender,
				},
			},
			applePay: {
				configured: false,
				isRecurringSupported: false,
				admin: {
					label: {
						icon: `${ assetsDir }/icon-full.svg`,
						text: 'Apple Pay',
					},
				},
				customer: {
					label: {
						text: 'Square Apple Pay',
					},
					render: CustomerRender,
				},
			},
			googlePay: {
				configured: false,
				isRecurringSupported: false,
				admin: {
					label: {
						icon: `${ assetsDir }/icon-full.svg`,
						text: 'Google Pay',
					},
				},
				customer: {
					label: {
						text: 'Square Google Pay',
					},
					render: CustomerRender,
				},
			},
		},
	} );
}
