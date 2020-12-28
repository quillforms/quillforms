import { setBlockAdminSettings } from '@quillforms/blocks';

/**
 * External Dependencies
 */
import ShortTextIcon from '@material-ui/icons/ShortText';

/**
 * Internal Dependencies
 */
import controls from './controls';
import { type } from '../block.json';

export const blockAdminSettings = {
	color: '#709a2d',
	icon: ShortTextIcon,
	controls,
};

setBlockAdminSettings( type, blockAdminSettings );
