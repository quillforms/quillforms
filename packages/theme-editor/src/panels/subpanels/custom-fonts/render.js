import { __experimentalAddonFeatureAvailability } from '@quillforms/admin-components';
import { __ } from '@wordpress/i18n';
import { css } from 'emotion';

import CustomButton from '../../../../../../client/components/custom-button';
import lockImage from '../../../../../../assets/images/lock.png';

const CustomFontsRender = () => {
	const customIcon = (
		<img
			src={lockImage}
			alt={__('Lock', 'quillforms')}
			className={css`
				width: 300px;
				height: 200px;
				object-fit: contain;
				margin: 0 auto 16px;
				display: block;
			`}
		/>
	);

	const customDescription = (
		<p
			className={css`
				font-size: 18px;
				line-height: 28px;
				color: #777;
				margin: 0 0 16px;
				font-weight: 500;
			`}
		>
			{__(
				"We're sorry, Custom Fonts is not available on your plan. Please upgrade to the Basic plan to unlock all of Basic features",
				'quillforms'
			)}
		</p>
	);

	const customButton = (
		<div
			className={css`
				display: flex;
				justify-content: center;
				width: 100%;
				margin-top: 16px;
			`}
		>
			<CustomButton
				text={__('Upgrade to Basic!', 'quillforms')}
				variant="primary"
				onClick={() => {
					window.open('https://quillforms.com', '_blank');
				}}
				className={css`
					font-size: 18px !important;
					padding: 12px 96px !important;
					border-radius: 16px !important;
				`}
			/>
		</div>
	);

	return (
		<div
			className={css`
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100%;
				font-size: 16px;
				line-height: 1.5em;
			`}
		>
			<__experimentalAddonFeatureAvailability
				featureName={__('Custom Fonts', 'quillforms')}
				addonSlug="customfonts"
				showLockIcon={true}
				customIcon={customIcon}
				customDescription={customDescription}
				customButton={customButton}
			/>
		</div>
	);
};

export default CustomFontsRender;