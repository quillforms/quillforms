/**
 * QuillForms Dependencies.
 */
import ConfigAPI from '@quillforms/config';

/**
 * WordPress Dependencies.
 */
import { addAction } from '@wordpress/hooks';

/**
 * Internal Dependencies.
 */
import { registerIntegrationModule } from '../api';
import Render from './render';
import SettingsRender from './settings-render';

// Free integrations that are handled separately (not as store addons)
const FREE_INTEGRATIONS = ['quillcrm'];

addAction(
	'QuillForms.Admin.PluginsLoaded',
	'QuillForms/FormIntegrations/RegisterStoreModules',
	register
);

function register() {
	for (const [slug, addon] of Object.entries(
		ConfigAPI.getStoreAddons()
	)) {
		// Skip free integrations - they're registered separately with their own components
		if (FREE_INTEGRATIONS.includes(slug)) {
			continue;
		}
		if (addon.is_integration) {
			registerIntegrationModule(slug, {
				title: addon.name,
				description: addon.description,
				icon: addon.assets.icon,
				render: Render,
				settingsRender: SettingsRender,
			});
		}
	}
}
