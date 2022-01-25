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
		formObj: { themeId, themesList },
	} = useFormContext();
	const currentBlock = useCurrentBlock();
	let appliedThemeId = themeId;
	if ( currentBlock?.attributes?.themeId ) {
		appliedThemeId = currentBlock.attributes.themeId;
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
	} as FormTheme;
};

export default useCurrentTheme;
