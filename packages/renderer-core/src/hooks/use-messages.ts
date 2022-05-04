/**
 * QuillForms Dependencies
 */
import type { FormMessages } from '@quillforms/types';

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
