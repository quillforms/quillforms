import { setBlockAdminSettings } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import { name } from '../block.json';
import Icon from './icon';

export const blockAdminSettings = {
	color: '#27aec3',
	icon: Icon,
	title: 'Email',
};

setBlockAdminSettings( name, blockAdminSettings );
