/**
 * QuillForms Dependencies
 */
import ConfigApi from '@quillforms/config';
import { __experimentalAddonFeatureAvailability } from '@quillforms/admin-components';

interface Props {
	slug: string;
	options: any;
	onOptionsChange: ( options ) => void;
}

const Render: React.FC< Props > = ( { slug, options, onOptionsChange } ) => {
	const addon = ConfigApi.getStoreAddons()[ slug ];

	return (
		<div style={ { marginBottom: '40px' } }>
			<__experimentalAddonFeatureAvailability
				featureName={ addon.name + ' Payment Gateway' }
				addonSlug={ slug }
				showLockIcon={ true }
			/>
		</div>
	);
};

export default Render;
