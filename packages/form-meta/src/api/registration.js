/* eslint no-console: [ 'error', { allow: [ 'error' ] } ] */
/**
 * WordPress Dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import { isFunction } from 'lodash';
/**
 * Register meta keys
 *
 * @param {string} name     Panel unique name.
 * @param {Object} settings Panel settings.
 *
 */
export const registerFormMeta = ( name, settings ) => {
	settings = {
		name,
		...settings,
	};
	if ( typeof name !== 'string' ) {
		console.error( 'Meta keys must be strings.' );
		return;
	}

	if ( ! settings.getValue ) {
		console.error( 'getValue setting is missing!' );
		return;
	}

	if ( ! isFunction( settings.getValue ) ) {
		console.error( 'The "save" property must be a valid function.' );
		return;
	}
	dispatch( 'quillForms/form-meta' ).registerFormMeta( settings );
};
