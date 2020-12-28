import { setBlockAdminSettings } from '@quillforms/blocks';

/**
 * External Dependencies
 */
import DnsIcon from '@material-ui/icons/Dns';

/**
 * Internal Dependencies
 */
import logicControl from './logic-control';
import controls from './controls';
import { type } from '../block.json';

export const blockAdminSettings = {
	color: '#bf2f2f',
	icon: DnsIcon,
	controls,
	logicControl,
};

setBlockAdminSettings( type, blockAdminSettings );
