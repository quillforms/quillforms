import { ProFeatureBanner } from "@quillforms/admin-components";
import "./style.css";
import { useState } from "react";
import { __ } from "@wordpress/i18n";

const DropOffAnalyticsDemo = () => {
    const [showDemoInfo, setShowDemoInfo] = useState(true);

    // Sample question analytics data
    const questionAnalytics = [
        { id: 1, question: __("What's your name?", "quillforms"), views: 1000, completions: 980, dropOffRate: 2 },
        { id: 2, question: __("What's your email?", "quillforms"), views: 980, completions: 890, dropOffRate: 9 },
        { id: 3, question: __("What's your age?", "quillforms"), views: 890, completions: 845, dropOffRate: 5 },
        { id: 4, question: __("Tell us about yourself", "quillforms"), views: 845, completions: 650, dropOffRate: 23 },
        { id: 5, question: __("Upload your resume", "quillforms"), views: 650, completions: 325, dropOffRate: 50 },
    ];

    return (
        <div className="form-insights-analytics-demo">
            {showDemoInfo && (
                <div className="form-insights-demo-overlay">
                    <div className="form-insights-demo-overlay-content">
                        <span className="form-insights-demo-overlay-icon">🎯</span>
                        <h3>{__("Demo Preview", "quillforms")}</h3>
                        <p>{__("This is a demonstration of the Form Analytics feature using sample data.", "quillforms")}</p>
                        <p>{__("Upgrade to Pro to access real-time analytics for your forms.", "quillforms")}</p>
                        <button
                            className="form-insights-demo-overlay-button"
                            onClick={() => setShowDemoInfo(false)}
                        >
                            {__("Explore Demo", "quillforms")}
                        </button>
                    </div>
                </div>
            )}

            <div className="form-insights-demo-watermark">
                <div className="form-insights-demo-watermark-text">
                    {__("DEMO PREVIEW", "quillforms")}
                </div>
            </div>

            <div className="form-insights-demo-controls">
                <button
                    className="form-insights-demo-info-button"
                    onClick={() => setShowDemoInfo(true)}
                >
                    <span>ℹ️</span> {__("About This Demo", "quillforms")}
                </button>
            </div>

            <div className="form-insights-demo-badge">
                <span className="form-insights-demo-badge-icon">⭐</span> {__("Pro Feature Demo", "quillforms")}
            </div>

            <h2>{__("Form Analytics & Drop-off Tracking", "quillforms")}</h2>
            <p className="form-insights-demo-subtitle">{__("See where users drop off and optimize your form completion rate", "quillforms")}</p>

            <div className="form-insights-funnel-visualization">
                <svg viewBox="0 0 400 300" className="form-insights-funnel-svg">
                    <path
                        className="form-insights-funnel-path"
                        d="M50,10 L350,10 L300,290 L100,290 Z"
                        fill="#f1f3f4"
                    />

                    <path
                        className="form-insights-flow-line"
                        d="M200,10 L200,290"
                        stroke="#1a73e8"
                        strokeDasharray="4,4"
                    />

                    <g className="form-insights-stage" transform="translate(200,60)">
                        <circle r="8" fill="#34a853" />
                        <text x="60" y="5" className="form-insights-stage-text">{__("Started (1000)", "quillforms")}</text>
                    </g>

                    <g className="form-insights-stage" transform="translate(200,150)">
                        <circle r="8" fill="#fbbc04" />
                        <text x="60" y="5" className="form-insights-stage-text">{__("In Progress (650)", "quillforms")}</text>
                    </g>

                    <g className="form-insights-stage" transform="translate(200,240)">
                        <circle r="8" fill="#ea4335" />
                        <text x="60" y="5" className="form-insights-stage-text">{__("Completed (325)", "quillforms")}</text>
                    </g>

                    <circle className="form-insights-moving-dot form-insights-dot1" r="4" fill="#1a73e8" />
                    <circle className="form-insights-moving-dot form-insights-dot2" r="4" fill="#1a73e8" />
                    <circle className="form-insights-moving-dot form-insights-dot3" r="4" fill="#1a73e8" />
                </svg>

                <div className="form-insights-analytics-insights">
                    <div className="form-insights-insight-item">
                        <span className="form-insights-insight-icon">📉</span>
                        <div className="form-insights-insight-content">
                            <strong>{__("32.5% Completion Rate", "quillforms")}</strong>
                            <span>{__("Form performance needs optimization", "quillforms")}</span>
                        </div>
                    </div>
                    <div className="form-insights-insight-item">
                        <span className="form-insights-insight-icon">⏱️</span>
                        <div className="form-insights-insight-content">
                            <strong>{__("4.5 min Average Time", "quillforms")}</strong>
                            <span>{__("Consider simplifying longer sections", "quillforms")}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="form-insights-question-analytics">
                <h3>{__("Question-Level Performance Analytics", "quillforms")}</h3>
                <div className="form-insights-table-container">
                    <table className="form-insights-analytics-table">
                        <thead>
                            <tr>
                                <th>{__("Question", "quillforms")}</th>
                                <th>{__("Views", "quillforms")}</th>
                                <th>{__("Completions", "quillforms")}</th>
                                <th>{__("Drop-off Rate", "quillforms")}</th>
                                <th>{__("Avg. Time", "quillforms")}</th>
                                <th>{__("Performance", "quillforms")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questionAnalytics.map((q) => (
                                <tr key={q.id}>
                                    <td className="form-insights-question-cell">
                                        <span className="form-insights-question-number">{`Q${q.id}`}</span>
                                        {q.question}
                                    </td>
                                    <td>{q.views.toLocaleString()}</td>
                                    <td>{q.completions.toLocaleString()}</td>
                                    <td>
                                        <span className={`form-insights-drop-off-rate ${q.dropOffRate > 20 ? 'form-insights-high-drop-off' : ''}`}>
                                            {`${q.dropOffRate}%`}
                                        </span>
                                    </td>
                                    <td>{q.timeSpent}</td>
                                    <td>
                                        <div className="form-insights-performance-bar-container">
                                            <div
                                                className="form-insights-performance-bar"
                                                style={{
                                                    width: `${100 - q.dropOffRate}%`,
                                                    backgroundColor: q.dropOffRate > 20 ? '#ea4335' : '#34a853'
                                                }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ProFeatureBanner featureName={__("Advanced Entries", "quillforms")} addonSlug="advancedentries" />
        </div>
    );
};

export default DropOffAnalyticsDemo;