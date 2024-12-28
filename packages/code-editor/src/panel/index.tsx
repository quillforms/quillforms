/**
 * QuillForms Dependencies
 */
import { registerBuilderSubPanel } from '@quillforms/builder-panels';


/**
 * Internal Dependencies
 */
import render from '../components/panel-render';
registerBuilderSubPanel('settings/code', {
	title: 'Custom CSS',
	render,
});


