/**
 * QuillForms Dependencies
 */
import ConfigApi from '@quillforms/config';
import { __experimentalAddonFeatureAvailability } from '@quillforms/admin-components';

interface Props {
	slug: string;
	options: any;
}

const ClientRender: React.FC< Props > = ( { slug } ) => {
	const addon = ConfigApi.getStoreAddons()[ slug ];

	return (
		<div style={ { marginBottom: '40px' } }>
			<__experimentalAddonFeatureAvailability
				featureName={ addon.name + ' Payment Method' }
				addonSlug={ slug }
				showLockIcon={ true }
			/>
		</div>
	);
};

export default ClientRender;
