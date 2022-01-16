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
import LabelNotice from '../label-notice';
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
	const assetsDir = ConfigAPI.getPluginDirUrl() + 'assets/addons/stripe';

	registerPaymentGatewayModule( 'stripe', {
		name: 'Stripe',
		description: 'Accept payments through stripe gateway.',
		icon: `${ assetsDir }/icon.png`,
		active: false,
		settings: Settings,
		methods: {
			elements: {
				isRecurringSupported: true,
				isCustomerRequired: {
					recurring: true,
				},
				admin: {
					label: {
						icon: `${ assetsDir }/stripe-wordmark-blurple.svg`,
						text: 'Elements',
						notice: LabelNotice,
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
				isRecurringSupported: true,
				isCustomerRequired: {
					recurring: true,
				},
				admin: {
					label: {
						icon: `${ assetsDir }/stripe-wordmark-blurple.svg`,
						text: 'Checkout',
						notice: LabelNotice,
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
