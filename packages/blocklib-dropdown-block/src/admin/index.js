import { setBlockAdminSettings } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import logicControl from './logic-control';
import controls from './controls';
import { type } from '../block.json';
import Icon from './dropdown-icon';

export const blockAdminSettings = {
	color: '#2eaf8b',
	title: 'Dropdown',
	icon: Icon,
	controls,
	logicControl,
};

setBlockAdminSettings( type, blockAdminSettings );
