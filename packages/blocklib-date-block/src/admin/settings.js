/**
 * Internal Dependencies
 */
import controls from './controls';
import Icon from './icon';
import { __ } from '@wordpress/i18n';

const blockAdminSettings = {
	color: '#93AE89',
	title: __('Date', 'quillforms'),
	icon: Icon,
	controls,
	order: 7,
};
export default blockAdminSettings;
