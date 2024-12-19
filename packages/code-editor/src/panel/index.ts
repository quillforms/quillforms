/**
 * QuillForms Dependencies
 */
import { registerBuilderSubPanel } from '@quillforms/builder-panels';

/**
 * Internal Dependencies
 */
import render from '../components/panel-render';
import Icon from './icon';
registerBuilderSubPanel('settings/code', {
	title: 'Custom CSS',
	render,
});
