/**
 * QuillForms Dependencies
 */
import { FormTheme } from '@quillforms/types/src';
import { getDefaultThemeProperties } from '@quillforms/utils';

/*
 * Internal Dependencies
 */
import useFormContext from './use-form-context';

const useGeneralTheme = () => {
	const {
		formObj: { theme },
	} = useFormContext();
	return {
		...getDefaultThemeProperties(),
		...theme,
	} as FormTheme;
};

export default useGeneralTheme;
