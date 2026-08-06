/**
 * WordPress Dependencies
 */
import { addAction } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import { registerIntegrationModule } from '../api';
import DoubleScaleSettings from './settings';
import DoubleScaleIcon from './icon';

// Register with priority 5 (before site-integrations which uses default 10)
// This ensures DoubleScale appears first in the integrations list
addAction(
	'QuillForms.Admin.PluginsLoaded',
	'QuillForms/FormIntegrations/RegisterDoubleScale',
	register,
	5
);

function register() {
	// Always register DoubleScale - it will show install CTA if not active
	registerIntegrationModule('doublescale', {
		title: __('DoubleScale', 'quillforms'),
		description: __(
			'Create and manage contacts in DoubleScale, our partner CRM, when forms are submitted.',
			'quillforms'
		),
		icon: DoubleScaleIcon,
		render: DoubleScaleSettings,
		settingsRender: DoubleScaleSettings,
	});
}
