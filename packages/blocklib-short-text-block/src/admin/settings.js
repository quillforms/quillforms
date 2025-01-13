/**
 * Internal Dependencies
 */
import controls from './controls';
import Icon from './icon';
import { __ } from '@wordpress/i18n';

const blockAdminSettings = {
	color: '#98DFAF',
	icon: Icon,
	controls,
	title: __('Short text', 'quillforms'),
	order: 2,
};

export default blockAdminSettings;
