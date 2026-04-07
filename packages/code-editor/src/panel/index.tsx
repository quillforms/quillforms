/**
 * QuillForms Dependencies
 */
import {
	registerBuilderSubPanel,
	settingsCustomCssIcon,
} from '@quillforms/builder-panels';
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import render from '../components/panel-render';
registerBuilderSubPanel('settings/code', {
	title: __('Custom CSS', 'quillforms'),
	render,
	position: 3,
	icon: settingsCustomCssIcon,
});

