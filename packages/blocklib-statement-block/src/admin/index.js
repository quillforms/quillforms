import { setBlockAdminSettings } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import controls from './controls';
import { name } from '../block.json';
import Icon from './icon';

export const blockAdminSettings = {
	color: '#ad468d',
	icon: Icon,
	controls,
	title: 'Statement',
};

setBlockAdminSettings( name, blockAdminSettings );
