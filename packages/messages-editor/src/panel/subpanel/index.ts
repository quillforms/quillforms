/**
 * QuillForms Dependencies
 */
import {
	registerBuilderSubPanel,
	settingsMessagesIcon,
} from '@quillforms/builder-panels';

/**
 * Internal Dependencies
 */
import render from '../../components/panel-render';
registerBuilderSubPanel( 'settings/messages', {
	title: 'Messages',
	render,
	position: 1,
	icon: settingsMessagesIcon,
} );
