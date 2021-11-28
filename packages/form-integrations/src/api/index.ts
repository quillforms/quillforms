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
import type { IntegrationModules, IntegrationModuleSettings } from '../types';

let integrationModules = {};

/**
 * Register Integration Module
 *
 * @param {string}                    slug     The module slug
 * @param {IntegrationModuleSettings} settings The module settings.
 *
 */
export const registerIntegrationModule = (
	slug: string,
	settings: IntegrationModuleSettings
) => {
	settings = applyFilters(
		'QuillForms.FormIntegrations.IntegrationModuleSettings',
		settings,
		slug
	) as IntegrationModuleSettings;

	if ( integrationModules[ slug ] ) {
		console.error( `This integration ${ slug } is already registered!` );
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

	if ( ! settings.render ) {
		console.error( `The 'render' property is mandatory!` );
		return;
	}

	if ( ! isFunction( settings.render ) ) {
		console.error( 'The "render" property must be a valid function!' );
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

	integrationModules[ slug ] = settings;
};

export const getIntegrationModules = (): IntegrationModules => {
	return integrationModules;
};

export const getIntegrationModule = ( slug: string ) => {
	return integrationModules[ slug ];
};
