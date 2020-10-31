/* eslint no-console: [ 'error', { allow: [ 'error' ] } ] */

/**
 * WordPress dependencies
 */
import { applyFilters, doAction } from '@wordpress/hooks';
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import { isFunction } from 'lodash';

/**
 * Defined behavior of a rest field.
 *
 * @typedef {Object} QFRestField
 *
 * @property {string}                name      A string identifying the rest field. Must be
 *                                              unique across all registered rest fields.
 *                                              unique across all registered plugins.
 * @property {Function}              getValue  A function returning the value for this rest field.
 *                                             This function is expected to select the value from
 *                                             custom wp/data store related to this field. T
 */

/**
 * Rest fields definitions keyed by rest field name.
 *
 * @type {Object.<string,QFRestField>}
 */
const restFields = {};

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
export const registerRestField = ( name, settings ) => {
	settings = {
		name,
		...settings,
	};
	if ( typeof name !== 'string' ) {
		console.error( 'Rest field key must be string.' );
		return;
	}

	if ( ! settings.getValue ) {
		console.error( 'getValue setting is missing!' );
		return;
	}

	if ( restFields[ name ] ) {
		console.error( `Rest field "${ name }" is already registered.` );
	}

	settings = applyFilters( 'qfRestfields.registerRestField', settings, name );

	if ( ! isFunction( settings.getValue ) ) {
		console.error( 'The "getValue" property must be a valid function.' );
		return;
	}

	// try {
	// 	settings.getValue( select );
	// } catch ( error ) {
	// 	console.error( '"getValue function is throwing an error!"' );
	// 	return;
	// }

	restFields[ name ] = {
		name,
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
 * @return {?QFRestField} Rest field setting.
 */
export function getRestField( name ) {
	return restFields[ name ];
}

/**
 * Returns all registered rest fields.
 *
 * @return {QFRestField[]} rest fields settings.
 */
export function getRestFields() {
	return Object.values( restFields );
}
