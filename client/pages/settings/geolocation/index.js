/**
 * QuillForms Dependencies
 */
import { __experimentalAddonFeatureAvailability } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { applyFilters } from '@wordpress/hooks';

const Geolocation = () => {
    return applyFilters(
        'QuillForms.Settings.Geolocation.Render',
        <__experimentalAddonFeatureAvailability
            featureName={'Geolocation'}
            addonSlug="geolocation"
            showLockIcon={true}
        />
    );
};

export default Geolocation; 