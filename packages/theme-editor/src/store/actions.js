/**
 * Internal Dependencies
 */
import { apiFetch, dispatch } from './controls';

import {
	SET_CURRENT_THEME_PROPERTIES,
	SET_CURRENT_THEME_TITLE,
	SET_SHOULD_BE_SAVED,
	SET_CURRENT_THEME_ID,
	ADD_NEW_THEME_SUCCESS,
	ADD_NEW_THEMES,
	UPDATE_THEME_SUCCESS,
	DELETE_THEME_SUCCESS,
	SET_IS_SAVING,
	SETUP_THEMES,
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
 * Set current theme title
 *
 *
 * @param {string} title  Theme title.
 *
 * @returns {Object} Action object.
 */
export const setCurrentThemeTitle = ( title ) => {
	return {
		type: SET_CURRENT_THEME_TITLE,
		title,
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
 * Set up fetched themes.

 * @param {Array} themes Themes to add.
 *
 * @return {Object} Action object.
 */
export const setUpThemes = ( themes ) => {
	return {
		type: SETUP_THEMES,
		payload: { themes },
	};
};

/**
 * Append new themes
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
 * Action generator for Adding new theme
 *
 * @param {string} title       Theme title.
 * @param {Object} properties  Theme properties.
 *
 */
export function* addNewTheme( title, properties ) {
	const path = '/qf/v1/themes';
	yield __unstableSetIsSaving( true );
	try {
		const newThemeId = yield apiFetch( {
			path,
			method: 'POST',
			data: { title, properties },
		} );

		yield dispatch(
			'core/notices',
			'createSuccessNotice',
			'🚀 Theme created successfully',
			{
				type: 'snackbar',
				isDismissible: true,
			}
		);
		yield __unstableAddNewThemeSuccess( newThemeId, title, properties );
	} catch ( error ) {
		yield dispatch(
			'core/notices',
			'createErrorNotice',
			'🙁 Error while theme creating',
			{
				type: 'snackbar',
				isDismissible: true,
			}
		);
	}
	yield __unstableSetIsSaving( false );
}

/**
 * Add new theme on front end after saving successfully on back end
 *
 * @param {number} themeId            Theme id
 * @param {string } themeTitle   	  Theme title
 * @param {Object} themeProperties    Theme data
 *
 * @return {Object} Action object.
 */
export const __unstableAddNewThemeSuccess = (
	themeId,
	themeTitle,
	themeProperties
) => {
	return {
		type: ADD_NEW_THEME_SUCCESS,
		payload: { themeId, themeTitle, themeProperties },
	};
};

/**
 *
 * @param {number} themeId  Theme id
 *
 */
export function* deleteTheme( themeId ) {
	const path = `/qf/v1/themes/${ themeId }`;

	try {
		yield apiFetch( {
			path,
			method: 'DELETE',
		} );
		yield dispatch(
			'core/notices',
			'createSuccessNotice',
			'✅ Theme deleted successfully',
			{
				type: 'snackbar',
				isDismissible: true,
			}
		);
		yield __unstableDeleteThemeSuccess( themeId );
	} catch ( err ) {
		yield dispatch(
			'core/notices',
			'createErrorNotice',
			'⛔ Error while theme deletion',
			{
				type: 'snackbar',
				isDismissible: true,
			}
		);
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
 * Update theme.
 *
 * @param {number} themeId          Theme id.
 * @param {string} themeTitle       Theme title.
 * @param {Object} themeProperties  Theme properties.
 *
 */
export function* updateTheme( themeId, themeTitle, themeProperties ) {
	yield __unstableSetIsSaving( true );

	const path = `/qf/v1/themes/${ themeId }`;

	try {
		yield apiFetch( {
			path,
			method: 'PUT',
			data: {
				title: themeTitle,
				properties: themeProperties,
			},
		} );
		yield dispatch(
			'core/notices',
			'createSuccessNotice',
			'🚀 Theme updated successfully',
			{
				type: 'snackbar',
				isDismissible: true,
			}
		);
		yield __unstableUpdateThemeSuccess(
			themeId,
			themeTitle,
			themeProperties
		);
	} catch ( err ) {
		yield dispatch(
			'core/notices',
			'createErrorNotice',
			'🙁 Error while theme updating',
			{
				type: 'snackbar',
				isDismissible: true,
			}
		);
	}
	yield __unstableSetIsSaving( false );
}

/**
 * After updating theme successfully at backend, this action would be dispatched to update the theme visually on front end.
 *
 * @param {number} themeId          Theme id
 * @param {string} themeTite        Theme title
 * @param {Object} themeProperties  Theme properties
 *
 * @return {Object} Action object
 */
export const __unstableUpdateThemeSuccess = (
	themeId,
	themeTitle,
	themeProperties
) => {
	return {
		type: UPDATE_THEME_SUCCESS,
		payload: { themeId, themeTitle, themeProperties },
	};
};

export const __unstableSetIsSaving = ( flag ) => {
	return {
		type: SET_IS_SAVING,
		payload: { flag },
	};
};
