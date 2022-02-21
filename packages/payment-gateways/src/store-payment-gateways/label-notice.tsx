/**
 * QuillForms Dependencies
 */
import ConfigApi from '@quillforms/config';
import { __experimentalAddonFeatureAvailability } from '@quillforms/admin-components';

/**
 * External Dependencies
 */
import { css } from 'emotion';

const LabelNotice: React.FC< { slug: string } > = ( { slug } ) => {
	const addon = ConfigApi.getStoreAddons()[ slug ];

	// TODO: see __experimentalAddonFeatureAvailability component
	return (
		<div
			className={ css`
				display: inline-block;
				font-style: normal;
				font-size: 10px;
				background: #6d78d8;
				color: #fff;
				padding: 0 5px;
				border-radius: 3px;
				margin-left: 6px;
			` }
		>
			PRO
		</div>
	);
};

export default LabelNotice;
