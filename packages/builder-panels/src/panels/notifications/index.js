import { PanelRender as render } from '@quillforms/notifications-editor';

import Icon from './icon';

export const panelSettings = {
	name: 'notifications',
	title: 'Notifications',
	icon: Icon,
	mode: 'single',
	areaToHide: 'preview-area',
	render,
};
