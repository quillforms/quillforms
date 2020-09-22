import NotificationsIcon from '@material-ui/icons/Notifications';
import { PanelRender as render } from '@quillforms/notifications-editor';

export const panelSettings = {
	name: 'notifications',
	title: 'Notifications',
	icon: NotificationsIcon,
	mode: 'single',
	areaToHide: 'preview-area',
	render,
};
