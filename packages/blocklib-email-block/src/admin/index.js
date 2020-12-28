import { setBlockAdminSettings } from '@quillforms/blocks';

/**
 * External Dependencies
 */
import EmailIcon from '@material-ui/icons/Email';

/**
 * Internal Dependencies
 */
import { type } from '../block.json';

export const blockAdminSettings = {
	color: '#27aec3',
	icon: EmailIcon,
};

setBlockAdminSettings( type, blockAdminSettings );
