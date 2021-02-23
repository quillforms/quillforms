/* eslint no-console: [ 'error', { allow: [ 'error' ] } ] */

/**
 * WordPress dependencies
 */
import { applyFilters, doAction } from '@wordpress/hooks';

/**
 * External dependencies
 */
import { isFunction } from 'lodash';

type RestFieldSettings = {
	/**
	 * Select Value.
	 * A function for selecting the value for this rest field.
	 * This function is expected to select the value from custom wp/data store related to this field.
	 */
	selectValue: () => unknown;

	/**
	 * Connected stores.
	 * We decided to build the admin with Single Page Application concept but there are various problems we faced.
	 * One of which is in builder. Builder depends on wp data stores and the challenge was how to force
	 * the (wp-data) stores to refresh their resolvers and re-calculate their resolved values within this SPA.
	 * That's why this param is here. You specify with your rest field the connected stores to it and all of
	 * the connected stores are gathered to have their resolution cache to be invalidated so it is like hard refresh for resolvers.
	 * However, it isn't necessray to pass this param.
	 *
	 * @see https://developer.wordpress.org/block-editor/packages/packages-data/#resolvers
	 */
	connectedStores?: string[];
};
/**
 * Defined behavior of a rest field.
 */

type RestFields = Record< string, RestFieldSettings >;
/**
 * Rest fields definitions keyed by rest field name.
 *
 */
const restFields: RestFields = {};

/**
 * Register rest fields
 *
 * @param {string} name     Rest field unique name. Must be unique.
 * @param {Object} settings Rest field settings.
 *
 * @example
 * registerRestField('rest-field-example', {
 *    getValue: (select) => select('my-example-store').myExampleSelector();
 * })
 */
export const registerRestField = (
	name: string,
	settings: RestFieldSettings
): RestFieldSettings | undefined => {
	if ( typeof name !== 'string' ) {
		console.error( 'Rest field key must be string.' );
		return;
	}

	if ( ! settings.selectValue ) {
		console.error( '"selectValue" setting is missing!' );
		return;
	}

	if ( ! isFunction( settings.selectValue ) ) {
		console.error( 'The "selectValue" property must be a valid function.' );
		return;
	}
	if ( restFields[ name ] ) {
		console.error( `Rest field "${ name }" is already registered.` );
	}

	settings = applyFilters(
		'qfRestfields.registerRestField',
		settings,
		name
	) as RestFieldSettings;

	restFields[ name ] = {
		...settings,
	};

	doAction( 'qfRestFields.restFieldRegistered', settings, name );

	return settings;
};

/**
 * Returns a registered rest field settings.
 *
 * @param {string} name Rest field name.
 *
 */
export function getRestField( name: string ): RestFieldSettings {
	return restFields[ name ];
}

/**
 * Returns all registered rest fields.
 */
export function getRestFields(): RestFields {
	return restFields;
}
