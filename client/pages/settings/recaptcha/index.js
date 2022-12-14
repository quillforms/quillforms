/**
 * QuillForms Dependencies
 */
import { __experimentalAddonFeatureAvailability } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { applyFilters } from '@wordpress/hooks';

const ReCAPTCHA = () => {
	return applyFilters(
		'QuillForms.Settings.ReCAPTCHA.Render',
		<__experimentalAddonFeatureAvailability
			featureName={ 'Google reCAPTCHA' }
			addonSlug="recaptcha"
			showLockIcon={ true }
		/>
	);
};

export default ReCAPTCHA;
