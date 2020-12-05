/**
 * WordPress Dependencies
 */
import { apiFetch } from '@wordpress/data-controls';

/**
 * Internal Dependencies
 */
import {
	SET_CURRENT_THEME_PROPERTIES,
	SET_SHOULD_BE_SAVED,
	SET_CURRENT_THEME_ID,
	ADD_NEW_THEME,
	ADD_NEW_THEMES,
	UPDATE_THEME,
	DELETE_THEME_SUCCESS,
} from './constants';

/**
 * Set current theme properties.
 * Returns an action object used in setting theme properties.
 *
 * @param {Object} properties Theme properties.
 *
 * @return {Object} Action object.
 */
export const setCurrentThemeProperties = ( properties ) => {
	return {
		type: SET_CURRENT_THEME_PROPERTIES,
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
 *
 * @param {Array} themes Themes to add.
 *
 * @return {Object} Action object.
 */
export const addNewThemes = ( themes ) => {
	return {
		type: ADD_NEW_THEMES,
		payload: { themes },
	};
};

/**
 * Add new theme
 *
 * @param {number}  themeId      Theme id
 * @param {string } themeTitle   Theme title
 * @param {Object}  themeData    Theme data
 *
 * @return {Object} Action object.
 */
export const addNewTheme = ( themeId, themeTitle, themeData ) => {
	return {
		type: ADD_NEW_THEME,
		payload: { themeId, themeTitle, themeData },
	};
};

/**
 *
 * @param {number} themeId  Theme id
 *
 */
export function* deleteTheme( themeId ) {
	const path = `/	qf/v1/themes/${ themeId }`;

	try {
		const result = yield apiFetch( {
			path,
			method: 'DELETE',
		} );
		if ( result?.deleted ) {
			yield __unstableDeleteThemeSuccess( themeId );
		}
	} catch ( err ) {
		console.log( err );
	}
}

/**
 * After deleting theme successfully at backend, this action would be dispatched to delete the theme visually on front end.
 *
 * @param {number} themeId  Theme id
 *
 * @return {Object} Action object
 */
export function __unstableDeleteThemeSuccess( themeId ) {
	return {
		type: DELETE_THEME_SUCCESS,
		payload: { themeId },
	};
}

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
