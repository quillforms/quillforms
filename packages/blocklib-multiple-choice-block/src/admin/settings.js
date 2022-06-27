/**
 * Internal Dependencies
 */
import controls from './controls';
import Icon from './icon';
import logicControl from './logic-control';
import entryDetails from './entry-details';
import getChoices from './get-choices';

const blockAdminSettings = {
	color: '#9e5210',
	icon: Icon,
	entryDetails,
	controls,
	logicControl,
	title: 'Multiple Choice',
	order: 5,
	getChoices,
};

export default blockAdminSettings;
