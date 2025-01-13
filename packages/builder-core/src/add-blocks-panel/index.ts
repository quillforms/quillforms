/**
 * QuillForms Dependencies
 */
import { registerBuilderPanel } from '@quillforms/builder-panels';
import { BlockTypesList } from "@quillforms/admin-components"

/**
 * WordPress Dependencies
 */
import { __ } from "@wordpress/i18n";


registerBuilderPanel('add-questions', {
    title: __('Add Questions', 'quillforms'),
    mode: 'single',
    render: BlockTypesList,
    isHidden: true,
    type: 'modal'
});
