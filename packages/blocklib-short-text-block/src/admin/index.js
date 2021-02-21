import { setBlockAdminSettings } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import controls from './controls';
import { type } from '../block.json';
import Icon from './icon';

export const blockAdminSettings = {
	color: '#709a2d',
	icon: Icon,
	controls,
	title: 'Short text',
};

setBlockAdminSettings( type, blockAdminSettings );
