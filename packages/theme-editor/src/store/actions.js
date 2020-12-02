import {
	SET_THEME_PROPERTIES,
	SET_SHOULD_BE_SAVED,
	SET_CURRENT_THEME_ID,
	SETUP_STORE,
	ADD_NEW_THEME,
	UPDATE_THEME,
} from './constants';

/**
 * Set up store.
 * Returns an action object used in signalling that store has been set up.
 *
 * @param {Object} initialPayload The initial payload
 *
 * @return {Object} Action object.
 */
export const setupStore = ( initialPayload ) => {
	return {
		type: SETUP_STORE,
		payload: { initialPayload },
	};
};

/**
 * Set theme properties.
 * Returns an action object used in setting theme properties.
 *
 * @param {Object} properties Theme properties.
 *
 * @return {Object} Action object.
 */
export const setThemeProperties = ( properties ) => {
	return {
		type: SET_THEME_PROPERTIES,
		payload: { properties },
	};
};

/**
 * Set should be saved.
 * Returns an action object used in setting should be saved property.
 *
 * @param {boolean} shouldBeSaved Should theme be saved or not.
 *
 * @return {Object} Action object.
 */
export const setShouldBeSaved = ( shouldBeSaved ) => {
	return {
		type: SET_SHOULD_BE_SAVED,
		payload: { shouldBeSaved },
	};
};

/**
 * Set Current Theme Id
 *
 * @param {number} currentThemeId Current Theme Id.
 *
 * @return {Object} Action object.
 */
export const setCurrentThemeId = ( currentThemeId ) => {
	return {
		type: SET_CURRENT_THEME_ID,
		payload: { currentThemeId },
	};
};

/**
 * Add new theme
 *
 * @param {string} themeId   Theme id
 * @param {Object} themeData Theme data
 *
 * @return {Object} Action object.
 */
export const addNewTheme = ( themeId, themeData ) => {
	return {
		type: ADD_NEW_THEME,
		payload: { themeData },
	};
};

/**
 * Update theme
 *
 * @param {Object} themeData Theme data
 * @param {string} themeId   Theme id
 *
 * @return {Object} Action object.
 */
export const updateTheme = ( themeData, themeId ) => {
	return {
		type: UPDATE_THEME,
		payload: { themeData, themeId },
	};
};
