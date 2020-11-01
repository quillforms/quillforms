/**
 * QuillForms Dependencies
 */
import { FormContentWrapper } from '@quillforms/renderer-core';
const FormPreview = () => {
	return (
		<div className="builder-core-preview-area">
			<FormContentWrapper applyConditionalLogic={ false } />
		</div>
	);
};
export default FormPreview;
