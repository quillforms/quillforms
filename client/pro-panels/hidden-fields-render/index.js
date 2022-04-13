import { __experimentalAddonFeatureAvailability } from '@quillforms/admin-components';
import { css } from 'emotion';

const HiddenFieldsRender = () => {
	return (
		<div
			className={ css`
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100%;
				font-size: 16px;
				line-height: 1.5em;
			` }
		>
			<__experimentalAddonFeatureAvailability
				featureName="Hidden Fields"
				addonSlug={ 'hiddenfields' }
				showLockIcon={ true }
			/>
		</div>
	);
};

export default HiddenFieldsRender;
