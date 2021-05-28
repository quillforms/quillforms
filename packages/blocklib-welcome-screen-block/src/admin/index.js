import { setBlockAdminSettings } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import { type } from '../block.json';
import Icon from './icon';
import controls from './controls';

export const blockAdminSettings = {
	color: '#45afaf',
	icon: Icon,
	title: 'Welcome Screen',
	controls,
};

setBlockAdminSettings( type, blockAdminSettings );
