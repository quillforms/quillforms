/**
 * QuillForms Dependencies
 */
import {
	registerBuilderSubPanel,
	settingsDocumentIcon,
} from '@quillforms/builder-panels';
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import render from '../components/panel-render';

registerBuilderSubPanel('settings/document', {
	title: __('Document', 'quillforms'),
	render,
	position: 2,
	icon: settingsDocumentIcon,
});
