/**
 * QuillForms Dependencies
 */
import { registerBuilderSubPanel } from '@quillforms/builder-panels';
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import render from '../components/panel-render';
registerBuilderSubPanel('settings/code', {
	title: __('Custom CSS', 'quillforms'),
	render,
});


