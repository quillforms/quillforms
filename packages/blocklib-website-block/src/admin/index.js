import { setBlockAdminSettings } from '@quillforms/blocks';

/**
 * External Dependencies
 */
import LinkIcon from '@material-ui/icons/Link';

/**
 * Internal Dependencies
 */
import { type } from '../block.json';

export const blockAdminSettings = {
	color: '#6b4646',
	icon: LinkIcon,
};

setBlockAdminSettings( type, blockAdminSettings );
