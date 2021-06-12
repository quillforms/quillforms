import { setBlockAdminSettings } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import controls from './controls';
import { name } from '../block.json';
import logicControl from './logic-control';
import Icon from './icon';

export const blockAdminSettings = {
	color: '#127fa9',
	icon: Icon,
	controls,
	logicControl,
	title: 'Number',
};

setBlockAdminSettings( name, blockAdminSettings );
