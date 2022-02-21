/**
 * QuillForms Dependencies
 */
import { getDefaultThemeProperties } from '@quillforms/utils';

/**
 * Internal Dependencies
 */
import useFormContext from './use-form-context';
import useCurrentBlock from './use-current-block';
import { FormTheme } from '@quillforms/types/src';

const useCurrentTheme = () => {
	const {
		formObj: { theme, themesList },
	} = useFormContext();
	const currentBlock = useCurrentBlock();
	let appliedTheme = theme;
	if ( currentBlock?.attributes?.themeId ) {
		appliedTheme = themesList.find(
			( $theme ) => $theme.id === currentBlock?.attributes?.themeId
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

export default useCurrentTheme;
