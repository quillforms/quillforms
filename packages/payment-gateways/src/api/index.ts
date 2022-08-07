/**
 * WordPress Dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * External Dependencies
 */
import { isFunction } from 'lodash';

/**
 * Internal Modules
 */
import type { PaymentGatewayModules, PaymentGatewayModule } from '../types';

let paymentGatewayModules = {};

/**
 * Register PaymentGateway Module
 *
 * @param {string}               slug     The module slug
 * @param {PaymentGatewayModule} module The module properties.
 *
 */
export const registerPaymentGatewayModule = (
	slug: string,
	module: PaymentGatewayModule
) => {
	module = applyFilters(
		'QuillForms.PaymentGateways.PaymentGatewayModule',
		module,
		slug
	) as PaymentGatewayModule;

	if ( paymentGatewayModules[ slug ] ) {
		console.error(
			`This payment gateway ${ slug } is already registered!`
		);
		return;
	}

	if ( ! module.name ) {
		console.error( `The 'name' property is mandatory!` );
		return;
	}

	if ( typeof module.name !== 'string' ) {
		console.error( `The 'name' property must be a string!` );
		return;
	}

	if ( ! module.icon ) {
		console.error( `The 'icon' property is mandatory!` );
		return;
	}

	if ( ! module.description ) {
		console.error( `The 'description' property is mandatory!` );
		return;
	}

	if ( module.settings && ! isFunction( module.settings ) ) {
		console.error( 'The "settings" property must be a valid function!' );
		return;
	}

	if ( ! module.methods ) {
		console.error( `The 'methods' property is mandatory!` );
		return;
	}

	for ( const _method of Object.values( module.methods ) ) {
		// TODO: method props check.
	}

	paymentGatewayModules[ slug ] = module;
};

export const getPaymentGatewayModules = (): PaymentGatewayModules => {
	return paymentGatewayModules;
};

export const getPaymentGatewayModule = ( slug: string ) => {
	return paymentGatewayModules[ slug ];
};
