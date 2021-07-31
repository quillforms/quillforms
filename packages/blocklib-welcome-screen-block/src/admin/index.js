import { setBlockAdminSettings } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import { name } from '../block.json';
import Icon from './icon';
import controls from './controls';

export const blockAdminSettings = {
	color: '#45afaf',
	icon: Icon,
	title: 'Welcome Screen',
	controls,
	order: 0,
};

setBlockAdminSettings( name, blockAdminSettings );
