/**
 * Internal Dependencies
 */
import controls from './controls';
import Icon from './icon';
import { __ } from '@wordpress/i18n';

const blockAdminSettings = {
	color: '#d62575',
	icon: Icon,
	controls,
	title: __('Slider', 'quillforms'),
	order: 6.5,
};

export default blockAdminSettings;
