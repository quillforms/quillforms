/**
 * WordPress Dependencies
 */
import { addAction } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import { registerIntegrationModule } from '../api';
import QuillCRMSettings from './settings';
import QuillCRMIcon from './icon';

// Register with priority 5 (before site-integrations which uses default 10)
// This ensures QuillCRM appears first in the integrations list
addAction(
	'QuillForms.Admin.PluginsLoaded',
	'QuillForms/FormIntegrations/RegisterQuillCRM',
	register,
	5
);

function register() {
	// Always register QuillCRM - it will show install CTA if not active
	registerIntegrationModule('quillcrm', {
		title: __('Quill CRM', 'quillforms'),
		description: __(
			'Create and manage contacts in Quill CRM when forms are submitted.',
			'quillforms'
		),
		icon: QuillCRMIcon,
		render: QuillCRMSettings,
		settingsRender: QuillCRMSettings,
	});
}
