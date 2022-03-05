/**
 * QuillForms Dependencies.
 */
import ConfigAPI from '@quillforms/config';

/**
 * WordPress Dependencies
 */
import { addAction } from '@wordpress/hooks';

/**
 * Internal Dependencies.
 */
import { registerIntegrationModule } from '../api';
import Render from './render';
import SettingsRender from './settings-render';

addAction(
	'QuillForms.Admin.PluginsLoaded',
	'QuillForms/FormIntegrations/RegisterStoreIntegrationModules',
	() => {
		for ( const [ slug, addon ] of Object.entries(
			ConfigAPI.getStoreAddons()
		) ) {
			if ( addon.is_integration ) {
				registerIntegrationModule( slug, {
					title: addon.name,
					description: addon.description,
					icon: addon.assets.icon,
					render: Render,
					settingsRender: SettingsRender,
				} );
			}
		}
	}
);
