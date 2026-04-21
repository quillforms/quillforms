/**
 * QuillForms Dependencies
 */
import { __experimentalAddonFeatureAvailability } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import CustomButton from '../../../components/custom-button';
import lockImage from '../../../../assets/images/lock.png';
import './style.scss';

const Geolocation = () => {
	const customIcon = (
		<img
			src={lockImage}
			alt="Lock"
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
				font-size: 14px;
				line-height: 28px;
				color: #777;
				margin: 0 0 16px;
				font-weight: 500;
			`}
		>
			{__(
				"We're sorry, Geolocation is not available on your plan. Please upgrade to the Basic plan to unlock all of Basic features",
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
					font-size: 14px !important;
					padding: 12px 96px !important;
					border-radius: 16px !important;
				`}
			/>
		</div>
	);

	return applyFilters(
		'QuillForms.Settings.Geolocation.Render',
		<div className="geolocation-feature-availability">
			<__experimentalAddonFeatureAvailability
				featureName={__('Geolocation', 'quillforms')}
				addonSlug="geolocation"
				showLockIcon={true}
				customIcon={customIcon}
				customDescription={customDescription}
				customButton={customButton}
			/>
		</div>
	);
};

export default Geolocation;
