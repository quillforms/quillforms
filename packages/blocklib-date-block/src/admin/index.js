/**
 * QuillForms Dependencies
 */
import { setBlockAdminSettings } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import controls from './controls';
import { name } from '../block.json';
import Icon from './icon';

export const blockAdminSettings = {
	color: '#93AE89',
	title: 'Date',
	icon: Icon,
	controls,
	order: 7,
};

setBlockAdminSettings( name, blockAdminSettings );
