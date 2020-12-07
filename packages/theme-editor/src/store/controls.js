/**
 * WordPress Dependencies
 */
import { createRegistryControl } from '@wordpress/data';

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

// the control
export const controls = {
	GET_THEME_ID: createRegistryControl( ( registry ) => () => {
		return registry.select( 'quillForms/theme-editor' ).getCurrentThemeId();
	} ),
	GET_SAVED_THEMES: createRegistryControl( ( registry ) => () => {
		return registry.select( 'quillForms/theme-editor' ).getThemesList();
	} ),
};
