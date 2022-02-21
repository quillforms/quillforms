/**
 * QuillForms Dependencies
 */
import ConfigAPI from '@quillforms/config';
import { getDefaultThemeProperties } from '@quillforms/utils';

/**
 * Internal dependencies
 */
import { apiFetch } from './controls';
import {
	setCurrentThemeId,
	setCurrentThemeProperties,
	setUpThemes,
} from './actions';

export function* getThemesList( state ) {
	const path = `/qf/v1/themes`;
	try {
		const themeId = ConfigAPI.getInitialPayload().theme.id;
		const themes = yield apiFetch( { path } );
		yield setUpThemes( themes );
		yield setCurrentThemeId( themeId );
		if ( ! themeId ) {
			yield setCurrentThemeProperties( getDefaultThemeProperties() );
		} else {
			return null;
		}
	} catch ( error ) {}
}
