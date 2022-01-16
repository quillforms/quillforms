/**
 * QuillForms Dependencies
 */
import ConfigApi from '@quillforms/config';
import { __experimentalAddonFeatureAvailability } from '@quillforms/admin-components';

const LabelNotice: React.FC< { slug: string } > = ( { slug } ) => {
	const addon = ConfigApi.getStoreAddons()[ slug ];

	// TODO: see __experimentalAddonFeatureAvailability component
	return (
		<div style={ { whiteSpace: 'nowrap', margin: '0 5px', color: 'blue' } }>
			PRO Feature
		</div>
	);
};

export default LabelNotice;
