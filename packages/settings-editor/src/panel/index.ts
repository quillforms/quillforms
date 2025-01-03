/**
 * QuillForms Dependencies
 */
import { registerBuilderSubPanel } from '@quillforms/builder-panels';
import '@quillforms/messages-editor';
/**
 * Internal Dependencies
 */
import render from '../components/panel-render';
registerBuilderSubPanel('settings/general', {
	title: 'General',
	render,
	position: 0,
	hasIcon: true
});
