import { setBlockAdminSettings } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import controls from './controls';
import Icon from './icon';
import logicControl from './logic-control';
import entryDetails from './entry-details';
import { name } from '../block.json';

export const blockAdminSettings = {
	color: '#9e5210',
	icon: Icon,
	entryDetails,
	controls,
	logicControl,
	title: 'Multiple Choice',
	order: 5,
};

setBlockAdminSettings( name, blockAdminSettings );
