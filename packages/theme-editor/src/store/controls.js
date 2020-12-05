/**
 * WordPress Dependencies
 */
import { createRegistryControl } from '@wordpress/data';

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
};
