import { setBlockAdminSettings } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import controls from './controls';
import { name } from '../block.json';
import Icon from './icon';

export const blockAdminSettings = {
	color: '#F2F4FC',
	icon: Icon,
	title: 'Quill Booking (Calendly Alternative)',
	controls,
	order: 3,
};

setBlockAdminSettings(name, blockAdminSettings);
