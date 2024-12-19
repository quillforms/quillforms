/**
 * Get current theme
 *
 * @param {Object} state Global application state.
 *
 * @return {Object} Default theme
 */
export function getCurrentTheme(state) {
	return {
		title: state?.currentTheme?.title ? state.currentTheme.title : '',
		properties: state?.currentTheme?.properties
			? state.currentTheme.properties
			: {},
	};
}

/**
 * Get current tab.
 *
 * @param {Object} state    Global application state.
 * 
 * @return {string} Current tab
 */
export function getCurrentTab(state) {
	return state.currentTab;
}

/**
 * Get current theme id.
 *
 * @param {Object} state    Global application state.
 *
 * @return {number} Current theme id
 */
export function getCurrentThemeId(state) {
	return state.currentThemeId;
}

export function getGalleryThemes(state) {
	return state.galleryThemes;
}
/**
 * Get themes list
 *
 * @param {Object} state     Global application state.
 *
 * @return {Object} Default theme
 */
export function getThemesList(state) {
	return state.themesList;
}

/**
 * Should theme be saved.
 *
 * @param {Object} state     Global application state.
 *
 * @return {boolean} Should theme be saved
 */
export function shouldThemeBeSaved(state) {
	return state.shouldBeSaved;
}

/**
 * Is theme being saved.
 *
 * @param {Object} state     Global application state.
 *
 * @return {boolean} Should theme be saved
 */
export function isSaving(state) {
	return state.isSaving;
}
