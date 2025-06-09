import { setBlockAdminSettings } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import './style.scss';
import { name } from '../block.json';
import Icon from './icon';
import controls from './controls';
export const blockAdminSettings = {
	color: '#bf5c73',
	icon: Icon,
	controls,
	title: 'Thank You Screen',
	order: 0,
};

setBlockAdminSettings( name, blockAdminSettings );
