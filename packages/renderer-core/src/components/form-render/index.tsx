/**
 * QuillForms Dependencies
 */
import { sanitizeBlocks } from '@quillforms/blocks';
import { getDefaultMessages } from '@quillforms/utils';
/**
 * Internal Dependencies
 */
import { FormContextProvider } from '../form-context';
import FormWrapper from '../form-wrapper';
import type { FormObj, SubmissionDispatchers } from '../../types';

interface Props {
	formId: number;
	formObj: FormObj;
	onSubmit: ( data: Object, dispatchers: SubmissionDispatchers ) => void;
	applyLogic: boolean;
	isPreview: boolean;
}
const Form: React.FC< Props > = ( {
	formObj,
	formId,
	onSubmit,
	applyLogic,
	isPreview = false,
} ) => {
	// This
	const formatFormObj = ( formObj: FormObj ): FormObj => {
		// If not in preview mode, sanitize blocks.
		// In preview mode, sanitizing is already done in block editor resolvers.
		if ( ! isPreview ) {
			formObj.blocks = sanitizeBlocks( formObj.blocks );
		}

		formObj.messages = {
			...getDefaultMessages(),
			...formObj.messages,
		};
		return formObj;
	};
	return (
		<FormContextProvider
			value={ {
				formObj: formatFormObj( formObj ),
				onSubmit,
				isPreview,
				formId,
			} }
		>
			<FormWrapper applyLogic={ applyLogic } />
		</FormContextProvider>
	);
};

export default Form;
