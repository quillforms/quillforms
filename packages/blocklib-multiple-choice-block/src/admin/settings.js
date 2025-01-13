/**
 * Internal Dependencies
 */
import controls from './controls';
import Icon from './icon';
import logicControl from './logic-control';
import entryDetails from './entry-details';
import getChoices from './get-choices';
import { __ } from '@wordpress/i18n';

const blockAdminSettings = {
	color: '#9B89B3',
	icon: Icon,
	entryDetails,
	controls,
	logicControl,
	title: __('Multiple Choice', 'quillforms'),
	order: 5,
	getChoices,
};

export default blockAdminSettings;
