/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * QuillForms Dependencies
 */
import { FormContentWrapper } from '@quillforms/renderer-core';

/**
 * External Dependencies
 */
import { mapKeys } from 'lodash';

const FormPreview = () => {
	const { formStructure, meta, theme } = useSelect( ( select ) => {
		return {
			formStructure: select(
				'quillForms/builder-core'
			).getFormStructure(),
			meta: mapKeys(
				select( 'quillForms/form-meta' ).getRegisteredMeta(),
				( metaItem, metakey ) => {
					return { [ metakey ]: metaItem.getValue( select ) };
				}
			),
			theme: select( 'quillForms/theme-editor' ).getCurrentTheme(),
		};
	} );

	return (
		<div className="builder-core-preview-area">
			<FormContentWrapper
				formStructure={ formStructure }
				meta={ meta }
				applyConditionalLogic={ false }
				theme={ theme }
			/>
		</div>
	);
};
export default FormPreview;
