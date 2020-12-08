/**
 * Get current theme
 *
 * @param {Object} state     Global application state.
 *
 * @return {Object} Default theme
 */
export function getCurrentTheme( state ) {
	return {
		title: state?.currentTheme?.title ? state.currentTheme.title : '',
		properties: state?.currentTheme?.properties
			? state.currentTheme.properties
			: {},
	};
}

/**
 * Get current theme id
 *
 * @param {Object} state    Global application state.
 *
 * @return {number} Current theme id
 */
export function getCurrentThemeId( state ) {
	return state.currentThemeId;
}

/**
 * Get themes list
 *
 * @param {Object} state     Global application state.
 *
 * @return {Object} Default theme
 */
export function getThemesList( state ) {
	return state.themesList;
}

/**
 * Should theme be saved
 *
 * @param {Object} state     Global application state.
 *
 * @return {boolean} Should theme be saved
 */
export function shouldThemeBeSaved( state ) {
	return state.shouldBeSaved;
}

/**
 * Is theme being saved
 *
 * @param {Object} state     Global application state.
 *
 * @return {boolean} Should theme be saved
 */
export function isSaving( state ) {
	return state.isSaving;
}
