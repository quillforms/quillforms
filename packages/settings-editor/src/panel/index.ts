/**
 * QuillForms Dependencies
 */
import {
	registerBuilderSubPanel,
	settingsGeneralIcon,
} from '@quillforms/builder-panels';
import '@quillforms/messages-editor';
/**
 * Internal Dependencies
 */
import render from '../components/panel-render';
registerBuilderSubPanel('settings/general', {
	title: 'General',
	render,
	position: 0,
	icon: settingsGeneralIcon,
});
