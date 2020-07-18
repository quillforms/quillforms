import DashboardIcon from '@material-ui/icons/Dashboard';
import { __experimentalBlocksList as render } from '@quillforms/builder-components';

export const panelSettings = {
	name: 'blocks',
	title: 'Form Blocks',
	icon: DashboardIcon,
	mode: 'single',
	areaToHide: null,
	render,
};
