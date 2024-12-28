const PartialSubmissionBanner = ({ onDismiss }) => (
    <div className="partial-submission-banner">
        <div className="partial-submission-banner__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 16V12" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 8H12.01" strokeWidth="2" strokeLinecap="round" />
            </svg>
        </div>
        <div className="partial-submission-banner__content">
            <h4>Enable Partial Form Submissions</h4>
            <p>Capture incomplete form data by setting partial submission points in your form blocks. This helps track where users drop off and collect valuable partial responses.</p>
        </div>
        <div className="partial-submission-banner__actions">
            <a className="partial-submission-banner__learn-more" href="https://quillforms.com/docs/how-to-collect-partial-submissions" target="_blank">
                Learn More
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </a>
            <button className="partial-submission-banner__dismiss" onClick={onDismiss}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M18 6L6 18M6 6L18 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    </div>
);

export default PartialSubmissionBanner;