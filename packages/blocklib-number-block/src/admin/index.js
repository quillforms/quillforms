import { setBlockAdminSettings } from '@quillforms/blocks';

/**
 * External Dependencies
 */
import { Event as DateIcon } from '@material-ui/icons';

/**
 * Internal Dependencies
 */
import controls from './controls';
import { type } from '../block.json';

export const blockAdminSettings = {
	color: '#93AE89',
	icon: DateIcon,
	controls,
};

setBlockAdminSettings( type, blockAdminSettings );
