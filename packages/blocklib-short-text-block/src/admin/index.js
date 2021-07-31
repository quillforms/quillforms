import { setBlockAdminSettings } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import controls from './controls';
import { name } from '../block.json';
import Icon from './icon';

export const blockAdminSettings = {
	color: '#709a2d',
	icon: Icon,
	controls,
	title: 'Short text',
	order: 1,
};

setBlockAdminSettings( name, blockAdminSettings );
