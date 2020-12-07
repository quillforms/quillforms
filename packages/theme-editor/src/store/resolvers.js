/**
 * QuillForms Dependencies
 */
import { getDefaultThemeProperties } from '@quillforms/utils';
/**
 * WordPress Dependencies
 */
import { apiFetch } from '@wordpress/data-controls';

/**
 * Internal dependencies
 */
import { getThemeId, getSavedThemes } from './controls';
import {
	setCurrentThemeId,
	setCurrentThemeProperties,
	addNewThemes,
} from './actions';

export function* getCurrentThemeId() {
	yield getSavedThemes();
	yield setCurrentThemeId( window.qfInitialPayload.theme_id );
}

export function* getCurrentTheme( state ) {
	const themeId = yield getThemeId();

	if ( ! themeId ) {
		yield setCurrentThemeProperties( getDefaultThemeProperties() );
	} else {
		return null;
	}
}

export function* getThemesList() {
	const path = `/qf/v1/themes`;
	try {
		const themes = yield apiFetch( { path } );
		yield addNewThemes( themes );
	} catch ( error ) {
		console.log( error );
	}
}
