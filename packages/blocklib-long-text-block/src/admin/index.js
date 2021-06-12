import { setBlockAdminSettings } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import controls from './controls';
import { name } from '../block.json';
import Icon from './icon';

export const blockAdminSettings = {
	color: '#A086C4',
	icon: Icon,
	controls,
	title: 'Long text',
};

setBlockAdminSettings( name, blockAdminSettings );
