/**
 * QuillForms Dependencies
 */
import { isValidIcon, normalizeIconObject } from '@quillforms/utils';

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
import type {
	PaymentGatewayModules,
	PaymentGatewayModuleSettings,
} from '../types';

let paymentGatewayModules = {};

/**
 * Register PaymentGateway Module
 *
 * @param {string}                    slug     The module slug
 * @param {PaymentGatewayModuleSettings} settings The module settings.
 *
 */
export const registerPaymentGatewayModule = (
	slug: string,
	settings: PaymentGatewayModuleSettings
) => {
	settings = applyFilters(
		'QuillForms.PaymentGateways.PaymentGatewayModuleSettings',
		settings,
		slug
	) as PaymentGatewayModuleSettings;

	if ( paymentGatewayModules[ slug ] ) {
		console.error(
			`This payment gateway ${ slug } is already registered!`
		);
		return;
	}

	if ( ! settings.name ) {
		console.error( `The 'name' property is mandatory!` );
		return;
	}

	if ( typeof settings.name !== 'string' ) {
		console.error( `The 'name' property must be a string!` );
		return;
	}

	if ( ! settings.icon ) {
		console.error( `The 'icon' property is mandatory!` );
		return;
	}

	if ( typeof settings.icon !== 'string' ) {
		settings.icon = normalizeIconObject( settings.icon );

		if ( ! isValidIcon( settings.icon.src ) ) {
			console.error( 'The "icon" property must be a valid function!' );
			return;
		}
	}

	if ( ! settings.description ) {
		console.error( `The 'description' property is mandatory!` );
		return;
	}

	if ( ! settings.settingsRender ) {
		console.error( `The 'settingsRender' property is mandatory!` );
		return;
	}

	if ( ! isFunction( settings.settingsRender ) ) {
		console.error(
			'The "settingsRender" property must be a valid function!'
		);
		return;
	}

	if ( ! settings.methods ) {
		console.error( `The 'methods' property is mandatory!` );
		return;
	}

	for ( const method of Object.values( settings.methods ) ) {
		if ( ! method.name ) {
			console.error( `The 'method.name' property is mandatory!` );
			return;
		}

		if ( typeof method.name !== 'string' ) {
			console.error( `The 'method.name' property must be a string!` );
			return;
		}

		if ( ! method.optionsRender ) {
			console.error(
				`The 'method.optionsRender' property is mandatory!`
			);
			return;
		}

		if ( ! isFunction( method.optionsRender ) ) {
			console.error(
				'The "method.optionsRender" property must be a valid function!'
			);
			return;
		}

		if ( ! method.clientRender ) {
			console.error( `The 'method.clientRender' property is mandatory!` );
			return;
		}

		if ( ! isFunction( method.clientRender ) ) {
			console.error(
				'The "method.clientRender" property must be a valid function!'
			);
			return;
		}
	}

	paymentGatewayModules[ slug ] = settings;
};

export const getPaymentGatewayModules = (): PaymentGatewayModules => {
	return paymentGatewayModules;
};

export const getPaymentGatewayModule = ( slug: string ) => {
	return paymentGatewayModules[ slug ];
};
