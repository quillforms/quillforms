import { setBlockAdminSettings } from '@quillforms/blocks';

/**
 * External Dependencies
 */
import longTextIcon from '@material-ui/icons/Subject';

/**
 * Internal Dependencies
 */
import controls from './controls';
import { type } from '../block.json';

export const blockAdminSettings = {
	color: '#A086C4',
	icon: longTextIcon,
	controls,
};

setBlockAdminSettings( type, blockAdminSettings );
