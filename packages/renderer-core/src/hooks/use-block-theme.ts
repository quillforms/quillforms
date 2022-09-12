/**
 * QuillForms Dependencies
 */
import { FormTheme } from '@quillforms/types/src';
import { getDefaultThemeProperties } from '@quillforms/utils';

/**
 * Internal Dependencies
 */
import useFormContext from './use-form-context';

/**
 * External Dependencies
 */
 import { size } from "lodash";

const useBlockTheme = ( blockThemeId: number | undefined ) => {
	const {
		formObj: { theme, themesList },
	} = useFormContext();
	let appliedTheme = theme;
	if ( blockThemeId && themesList !== undefined && size(themesList) > 0 ) {
		appliedTheme = themesList.find(
			( $theme ) => $theme.id === blockThemeId
		)?.properties as FormTheme;
	}
	if ( ! appliedTheme ) {
		appliedTheme = {};
	}
	return {
		...getDefaultThemeProperties(),
		...appliedTheme,
	} as FormTheme;
};

export default useBlockTheme;
