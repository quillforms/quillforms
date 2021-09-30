/**
 * QuillForms Dependencies.
 */
import ConfigAPI from '@quillforms/config';

/**
 * Internal Dependencies.
 */
import { registerIntegrationModule } from '../api';
import Render from './render';

for ( const [ slug, addon ] of Object.entries( ConfigAPI.getStoreAddons() ) ) {
	if ( addon.is_integration ) {
		registerIntegrationModule( slug, {
			title: addon.name,
			description: addon.description,
			icon: addon.assets.icon,
			render: <Render slug={ slug } addon={ addon } />,
			connectedStores: [],
		} );
	}
}
