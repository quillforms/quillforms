import { __ } from '@wordpress/i18n';
import AlertIcon from '../../../../components/icon/alert-icon';
import RightIcon from '../../../../components/icon/right-icon';

const PartialSubmissionBanner = ({ onDismiss }) => (
	<div className="partial-submission-banner">
		<AlertIcon />
		<div className="partial-submission-banner__content">
			<h4>{__('Enable Partial Form Submissions', 'quillforms')}</h4>
			<p>
				{__(
					'Capture incomplete form data by setting partial submission points in your form blocks. This helps track where users drop off and collect valuable partial responses.',
					'quillforms'
				)}{' '}
				<a
					className="partial-submission-banner__learn-more"
					href="https://quillforms.com/docs/how-to-collect-partial-submissions"
					target="_blank"
					rel="noreferrer"
				>
					{__('Learn More', 'quillforms')} <RightIcon width={24} height={24} />
				</a>
			</p>
		</div>
		<div className="partial-submission-banner__actions">
			<button className="partial-submission-banner__dismiss" onClick={onDismiss}>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<path d="M18 6L6 18M6 6L18 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</button>
		</div>
	</div>
);

export default PartialSubmissionBanner;
