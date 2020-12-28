import { setBlockAdminSettings } from '@quillforms/blocks';

/**
 * External Dependencies
 */
import CheckIcon from '@material-ui/icons/Check';

/**
 * Internal Dependencies
 */
import controls from './controls';
import logicControl from './logic-control';
import { type } from '../block.json';

export const blockAdminSettings = {
	color: '#9e5210',
	icon: CheckIcon,
	controls,
	logicControl,
};

setBlockAdminSettings( type, blockAdminSettings );
