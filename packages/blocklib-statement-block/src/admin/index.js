import { setBlockAdminSettings } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import controls from './controls';
import { type } from '../block.json';
import Icon from './icon';

export const blockAdminSettings = {
	color: '#ad468d',
	icon: Icon,
	controls,
};

setBlockAdminSettings( type, blockAdminSettings );
