import { setBlockAdminSettings } from '@quillforms/blocks';

/**
 * External Dependencies
 */
import FormatQuoteIcon from '@material-ui/icons/FormatQuote';

/**
 * Internal Dependencies
 */
import controls from './controls';
import { type } from '../block.json';

export const blockAdminSettings = {
	color: '#ad468d',
	icon: FormatQuoteIcon,
	controls,
};

setBlockAdminSettings( type, blockAdminSettings );
