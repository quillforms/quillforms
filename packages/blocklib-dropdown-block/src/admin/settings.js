/**
 * Internal Dependencies
 */
import logicControl from './logic-control';
import controls from './controls';
import Icon from './dropdown-icon';
import getChoices from './get-choices';

const blockAdminSettings = {
	color: '#2eaf8b',
	title: 'Dropdown',
	icon: Icon,
	controls,
	logicControl,
	order: 6,
	getChoices,
};
export default blockAdminSettings;
