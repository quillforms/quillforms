/**
 * QuillForms Dependencies
 */
import { registerBuilderPanel } from '@quillforms/builder-panels';

/**
 * Internal Dependencies
 */
import render from '../components/panel-render';

import Icon from './icon';

registerBuilderPanel('notifications', {
	title: 'Email Notifications',
	icon: Icon,
	mode: 'single',
	render,
	position: 3,
	hasIcon: true,
});
