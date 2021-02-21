/**
 * QuillForms Dependencies
 */
import { setBlockAdminSettings } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import controls from './controls';
import { type } from '../block.json';
import Icon from './icon';

export const blockAdminSettings = {
	color: '#93AE89',
	title: 'Date',
	icon: Icon,
	controls,
};

setBlockAdminSettings( type, blockAdminSettings );
