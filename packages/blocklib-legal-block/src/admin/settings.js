/**
 * Internal Dependencies
 */
import controls from './controls';
import Icon from './icon';
import logicControl from './logic-control';
import entryDetails from './entry-details';
import getChoices from './get-choices';

const blockAdminSettings = {
	color: '#1f7970',
	icon: Icon,
	entryDetails,
	controls,
	logicControl,
	title: 'Legal',
	order: 6,
	getChoices,
};

export default blockAdminSettings;
