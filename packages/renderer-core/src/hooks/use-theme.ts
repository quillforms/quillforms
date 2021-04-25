/**
 * QuillForms Dependencies
 */
import { FormTheme } from '@quillforms/config';

/**
 * Internal Dependencies
 */
import useFormContext from './use-form-context';

const useTheme = (): FormTheme => {
	const {
		formObj: { theme },
	} = useFormContext();
	return {
		...theme,
	} as FormTheme;
};

export default useTheme;
