/**
 * QuillForms Dependencies
 */
import ConfigApi from '@quillforms/config';
import { __experimentalAddonFeatureAvailability } from '@quillforms/admin-components';

const SettingsRender: React.FC< { slug: string } > = ( { slug } ) => {
	const addon = ConfigApi.getStoreAddons()[ slug ];

	return (
		<__experimentalAddonFeatureAvailability
			featureName={ addon.name + ' Integration' }
			addonSlug={ slug }
			showLockIcon={ true }
		/>
	);
};

export default SettingsRender;
