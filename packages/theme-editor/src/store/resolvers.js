/**
 * QuillForms Dependencies
 */
import getDefaultThemeProperties from '../get-default-theme-properties';

/**
 * Internal dependencies
 */
import { apiFetch } from './controls';
import {
	setCurrentThemeId,
	setCurrentThemeProperties,
	addNewThemes,
} from './actions';

export function* getCurrentTheme( state ) {
	const path = `/qf/v1/themes`;
	try {
		const themes = yield apiFetch( { path } );
		yield addNewThemes( themes );
		yield setCurrentThemeId( window.qfInitialPayload.theme );
		const themeId = window.qfInitialPayload.theme;

		if ( ! themeId ) {
			yield setCurrentThemeProperties( getDefaultThemeProperties() );
		} else {
			return null;
		}
	} catch ( error ) {
		console.log( error );
	}
}
