import { EnhancedProLabel, ProButton } from "@quillforms/admin-components";

const PartialSubmissionContent = () => {
    return (
        <div className="partial-submission-wrapper">
            <div className="partial-submission-content">
                <div className="partial-submission-left">
                    <div className="partial-submission-header-section">
                        <EnhancedProLabel />
                        <h2>Capture Every Potential Lead</h2>
                        <p className="partial-submission-subtitle">Get valuable responses even if users don't complete your form</p>
                    </div>
                    {
                        <div className="partial-submission-benefits-section">
                            <div className="partial-submission-value-proposition">
                                <div className="partial-submission-stat-highlight">
                                    <span className="partial-submission-stat">47%</span>
                                    <span className="partial-submission-stat-text">of form visitors abandon before completion</span>
                                </div>
                                <p className="partial-submission-value-text">Don't lose valuable leads. Capture responses when users reach your partial submission checkpoint, even if they don't complete the entire form.</p>
                            </div>
                        </div>
                    }

                    <ProButton className="partial-submission-upgrade-btn" addonSlug="advancedentries" />
                </div>

                <div className="partial-submission-right">
                    <svg viewBox="0 0 300 400" className="partial-submission-illustration">
                        <defs>
                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: '#f0f9ff', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: '#e1f3fe', stopOpacity: 1 }} />
                            </linearGradient>
                        </defs>
                        <rect x="0" y="0" width="300" height="400" fill="url(#grad1)" />
                        <g className="partial-submission-leads-flow" transform="translate(40, 80)">
                            <path className="partial-submission-flow-path" d="M20 100 C90 100, 130 50, 200 50" stroke="#0066cc" strokeWidth="2" fill="none" />
                            <circle className="partial-submission-flow-dot" cx="20" cy="100" r="8" fill="#0066cc" />
                            <circle className="partial-submission-flow-dot" cx="200" cy="50" r="8" fill="#0066cc" />

                            <rect x="40" y="120" width="160" height="180" rx="10" fill="white" stroke="#0066cc" strokeWidth="2" />
                            <g className="partial-submission-form-contents" transform="translate(60, 140)">
                                <rect width="120" height="12" rx="2" fill="#cce0f5" />
                                <rect y="30" width="90" height="12" rx="2" fill="#cce0f5" />
                                <rect y="60" width="100" height="12" rx="2" fill="#cce0f5" />
                            </g>

                            <g className="partial-submission-contact-cards" transform="translate(160, 20)">
                                <rect className="partial-submission-card" x="0" y="0" width="80" height="40" rx="6" fill="white" stroke="#00994d" strokeWidth="2" />
                                <rect className="partial-submission-card" x="-20" y="-10" width="80" height="40" rx="6" fill="white" stroke="#00994d" strokeWidth="2" />
                            </g>
                        </g>
                    </svg>
                </div>
            </div>
        </div>
    )
}
export default PartialSubmissionContent;