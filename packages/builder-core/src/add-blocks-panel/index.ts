/**
 * QuillForms Dependencies
 */
import { registerBuilderPanel } from '@quillforms/builder-panels';
import { BlockTypesList } from "@quillforms/admin-components"
/**
 * Internal Dependencies
 */


registerBuilderPanel('add-questions', {
    title: 'Add Questions',
    mode: 'single',
    render: BlockTypesList,
    isHidden: true,
    type: 'modal'
});
