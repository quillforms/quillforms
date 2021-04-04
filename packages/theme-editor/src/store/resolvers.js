/**
 * QuillForms Dependencies
 */
import ConfigAPI from '@quillforms/config';

/**
 * Internal dependencies
 */
import { apiFetch } from './controls';
import {
	setCurrentThemeId,
	setCurrentThemeProperties,
	addNewThemes,
} from './actions';
import getDefaultThemeProperties from '../get-default-theme-properties';

export function* getCurrentTheme( state ) {
	const path = `/qf/v1/themes`;
	try {
		const themeId = ConfigAPI.getInitialBuilderPayload().theme.id;
		console.log( themeId );
		const themes = yield apiFetch( { path } );
		yield addNewThemes( themes );
		yield setCurrentThemeId( themeId );
		if ( ! themeId ) {
			yield setCurrentThemeProperties( getDefaultThemeProperties() );
		} else {
			return null;
		}
	} catch ( error ) {
		// console.log( error );
	}
}
