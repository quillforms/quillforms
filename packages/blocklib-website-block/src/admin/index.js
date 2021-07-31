import { setBlockAdminSettings } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import { name } from '../block.json';
import Icon from './icon';

export const blockAdminSettings = {
	color: '#6b4646',
	icon: Icon,
	title: 'Website',
	order: 8,
};

setBlockAdminSettings( name, blockAdminSettings );
