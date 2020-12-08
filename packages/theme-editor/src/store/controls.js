/**
 * WordPress dependencies
 */
import { default as triggerApiFetch } from '@wordpress/api-fetch';
import { createRegistryControl } from '@wordpress/data';

/**
 * Trigger an API Fetch request.
 *
 * @param {Object} request API Fetch Request Object.
 * @return {Object} control descriptor.
 */
export function apiFetch( request ) {
	return {
		type: 'API_FETCH',
		request,
	};
}

/**
 * Gets theme list
 */
export function getSavedThemes() {
	return {
		type: 'GET_SAVED_THEMES',
	};
}

/**
 * Selects theme id
 *
 * @return {Object} Action.
 */
export function getThemeId() {
	return {
		type: 'GET_THEME_ID',
	};
}

/**
 * Dispatches an action using chosen registry.
 *
 * @param {string} registryName Registry name.
 * @param {string} actionName   Action name.
 * @param {Array} args          Selector arguments.
 * @return {Object} control descriptor.
 */
export function dispatch( registryName, actionName, ...args ) {
	return {
		type: 'DISPATCH',
		registryName,
		actionName,
		args,
	};
}

// the control
const controls = {
	API_FETCH( { request } ) {
		return triggerApiFetch( request );
	},
	GET_THEME_ID: createRegistryControl( ( registry ) => () => {
		return registry.select( 'quillForms/theme-editor' ).getCurrentThemeId();
	} ),

	GET_SAVED_THEMES: createRegistryControl( ( registry ) => () => {
		return registry.select( 'quillForms/theme-editor' ).getThemesList();
	} ),

	DISPATCH: createRegistryControl(
		( registry ) => ( { registryName, actionName, args } ) => {
			return registry.dispatch( registryName )[ actionName ]( ...args );
		}
	),
};

export default controls;
