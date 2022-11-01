/**
 * QuillForms Dependencies
 */
import { registerBuilderPanel } from '@quillforms/builder-panels';

/**
 * Internal Dependencies
 */
import render from '../components/panel-render';

import Icon from './icon';

registerBuilderPanel( 'notifications', {
	title: 'Email Notifications',
	icon: Icon,
	mode: 'single',
	areaToShow: 'drop-area',
	render,
	position: 3,
} );
