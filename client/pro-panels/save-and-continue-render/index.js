import { __experimentalAddonFeatureAvailability } from '@quillforms/admin-components';
import { css } from 'emotion';

const SaveAndContiuneRender = () => {
    return (
        <div
            className={css`
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100%;
				font-size: 16px;
				line-height: 1.5em;
			` }
        >
            <__experimentalAddonFeatureAvailability
                featureName={'Save and Continue'}
                addonSlug={'saveandcontinue'}
                showLockIcon={true}
            />
        </div>
    );
};

export default SaveAndContiuneRender;
