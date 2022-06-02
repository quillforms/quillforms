/**
 * QuillForms Dependencies
 */
import ConfigApi from '@quillforms/config';
import { __experimentalAddonFeatureAvailability } from '@quillforms/admin-components';

const Render: React.FC< { slug: string } > = ( { slug } ) => {
	const addon = ConfigApi.getStoreAddons()[ slug ];

	return (
		<div style={ { marginBottom: '40px' } }>
			<__experimentalAddonFeatureAvailability
				featureName={ addon.name + ' Integration' }
				addonSlug={ slug }
				showLockIcon={ true }
			/>
		</div>
	);
};

export default Render;
