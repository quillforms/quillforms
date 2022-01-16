/**
 * QuillForms Dependencies
 */
import { getDefaultThemeProperties } from '@quillforms/utils';

/**
 * Internal Dependencies
 */
import useFormContext from './use-form-context';

const useBlockTheme = ( themeId ) => {
	const {
		formObj: { theme, themesList },
	} = useFormContext();
	console.log( theme, themesList );
	let appliedThemeId = theme;
	if ( themeId ) {
		appliedThemeId = themeId;
	}

	let appliedTheme = themesList.find(
		( $theme ) => $theme.id === appliedThemeId
	)?.properties;
	if ( ! appliedTheme ) {
		appliedTheme = {};
	}
	return {
		...getDefaultThemeProperties(),
		...appliedTheme,
	};
};

export default useBlockTheme;
