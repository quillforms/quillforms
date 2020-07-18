/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import { FormContentWrapper } from '@quillforms/renderer-core';

const FormPreview = () => {
	const {
		formStructure,
		editableFields,
		currentBlockId,
		currentBlockCat,
	} = useSelect( ( select ) => {
		return {
			currentBlockId: select(
				'quillForms/builder-core'
			).getCurrentBlockId(),
			currentBlockCat: select(
				'quillForms/builder-core'
			).getCurrentBlockCat(),
			formStructure: select(
				'quillForms/builder-core'
			).getFormStructure(),
			editableFields: select(
				'quillForms/builder-core'
			).getEditableFields(),
		};
	} );

	return (
		<div className="builder-core-preview-area">
			<FormContentWrapper
				currentBlockId={ currentBlockId }
				currentBlockCat={ currentBlockCat }
				formStructure={ formStructure }
				editableFields={ editableFields }
			/>
		</div>
	);
};
export default FormPreview;
