import { setBlockAdminSettings } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import controls from './controls';
import Icon from './icon';
import logicControl from './logic-control';
import { type } from '../block.json';

export const blockAdminSettings = {
	color: '#9e5210',
	icon: Icon,
	controls,
	logicControl,
};

setBlockAdminSettings( type, blockAdminSettings );
