/**
 * QuillForms Dependencies
 */
import { __experimentalAddonFeatureAvailability } from '@quillforms/admin-components';

/**
 * Internal Dependencies
 */
import './style.scss';

const ResultsPage = () => {
	return (
		<div className="quillforms-results-page">
			<__experimentalAddonFeatureAvailability
				featureName="Results"
				addonSlug="entries"
				showLockIcon={ true }
			/>
		</div>
	);
};

export default ResultsPage;
