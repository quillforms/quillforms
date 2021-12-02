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

	if ( ! settings.optionsRender ) {
		console.error( `The 'optionsRender' property is mandatory!` );
		return;
	}

	if ( ! isFunction( settings.optionsRender ) ) {
		console.error(
			'The "optionsRender" property must be a valid function!'
		);
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

	if ( ! settings.title ) {
		console.error( `The 'title' property is mandatory!` );
		return;
	}

	if ( typeof settings.title !== 'string' ) {
		console.error( `The 'title' property must be a string!` );
		return;
	}

	if ( ! settings.description ) {
		console.error( `The 'description' property is mandatory!` );
		return;
	}

	if ( typeof settings.description !== 'string' ) {
		console.error( `The 'title' property must be a string!` );
		return;
	}

	if ( typeof settings.active !== 'boolean' ) {
		console.error( `The 'active' property must be a boolean!` );
		return;
	}

	paymentGatewayModules[ slug ] = settings;
};

export const getPaymentGatewayModules = (): PaymentGatewayModules => {
	return paymentGatewayModules;
};

export const getPaymentGatewayModule = ( slug: string ) => {
	return paymentGatewayModules[ slug ];
};
