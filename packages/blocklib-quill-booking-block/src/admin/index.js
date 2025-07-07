import { setBlockAdminSettings } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import controls from './controls';
import { name } from '../block.json';
import Icon from './icon';

export const blockAdminSettings = {
    color: '#45B7D1',
    icon: Icon,
    title: 'Booking',
    controls,
    order: 3,
};

setBlockAdminSettings(name, blockAdminSettings);
