/**
 * Internal Dependencies
 */
import controls from './controls';
import Icon from './icon';
import { __ } from '@wordpress/i18n';

const blockAdminSettings = {
	color: '#87BBFD',
	icon: Icon,
	controls,
	title: __('Long text', 'quillforms'),
	order: 2.5,
};

export default blockAdminSettings;
