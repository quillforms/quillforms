/**
 * QuillForms Dependencies
 */
import type { FormMessages } from '@quillforms/config';

import useFormContext from './use-form-context';

const useMessages = (): FormMessages => {
	const {
		formObj: { messages },
	} = useFormContext();
	return {
		...( messages as FormMessages ),
	};
};

export default useMessages;
