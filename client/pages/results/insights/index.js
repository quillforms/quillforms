import { ProFeatureBanner } from "@quillforms/admin-components";
import "./style.css";
import { useState } from "react";

const DropOffAnalyticsDemo = () => {
    const [showDemoInfo, setShowDemoInfo] = useState(true);

    // Sample question analytics data
    const questionAnalytics = [
        { id: 1, question: "What's your name?", views: 1000, completions: 980, dropOffRate: 2 },
        { id: 2, question: "What's your email?", views: 980, completions: 890, dropOffRate: 9 },
        { id: 3, question: "What's your age?", views: 890, completions: 845, dropOffRate: 5 },
        { id: 4, question: "Tell us about yourself", views: 845, completions: 650, dropOffRate: 23 },
        { id: 5, question: "Upload your resume", views: 650, completions: 325, dropOffRate: 50 },
    ];

    return (
        <div className="form-insights-analytics-demo">
            {showDemoInfo && (
                <div className="form-insights-demo-overlay">
                    <div className="form-insights-demo-overlay-content">
                        <span className="form-insights-demo-overlay-icon">🎯</span>
                        <h3>Demo Preview</h3>
                        <p>This is a demonstration of the Form Analytics feature using sample data.</p>
                        <p>Upgrade to Pro to access real-time analytics for your forms.</p>
                        <button
                            className="form-insights-demo-overlay-button"
                            onClick={() => setShowDemoInfo(false)}
                        >
                            Explore Demo
                        </button>
                    </div>
                </div>
            )}

            <div className="form-insights-demo-watermark">
                <div className="form-insights-demo-watermark-text">
                    DEMO PREVIEW
                </div>
            </div>

            <div className="form-insights-demo-controls">
                <button
                    className="form-insights-demo-info-button"
                    onClick={() => setShowDemoInfo(true)}
                >
                    <span>ℹ️</span> About This Demo
                </button>
            </div>

            <div className="form-insights-demo-badge">
                <span className="form-insights-demo-badge-icon">⭐</span> Pro Feature Demo
            </div>

            <h2>Form Analytics & Drop-off Tracking</h2>
            <p className="form-insights-demo-subtitle">See where users drop off and optimize your form completion rate</p>

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
                        <text x="60" y="5" className="form-insights-stage-text">Started (1000)</text>
                    </g>

                    <g className="form-insights-stage" transform="translate(200,150)">
                        <circle r="8" fill="#fbbc04" />
                        <text x="60" y="5" className="form-insights-stage-text">In Progress (650)</text>
                    </g>

                    <g className="form-insights-stage" transform="translate(200,240)">
                        <circle r="8" fill="#ea4335" />
                        <text x="60" y="5" className="form-insights-stage-text">Completed (325)</text>
                    </g>

                    <circle className="form-insights-moving-dot form-insights-dot1" r="4" fill="#1a73e8" />
                    <circle className="form-insights-moving-dot form-insights-dot2" r="4" fill="#1a73e8" />
                    <circle className="form-insights-moving-dot form-insights-dot3" r="4" fill="#1a73e8" />
                </svg>

                <div className="form-insights-analytics-insights">
                    <div className="form-insights-insight-item">
                        <span className="form-insights-insight-icon">📉</span>
                        <div className="form-insights-insight-content">
                            <strong>32.5% Completion Rate</strong>
                            <span>Form performance needs optimization</span>
                        </div>
                    </div>
                    <div className="form-insights-insight-item">
                        <span className="form-insights-insight-icon">⏱️</span>
                        <div className="form-insights-insight-content">
                            <strong>4.5 min Average Time</strong>
                            <span>Consider simplifying longer sections</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="form-insights-question-analytics">
                <h3>Question-Level Performance Analytics</h3>
                <div className="form-insights-table-container">
                    <table className="form-insights-analytics-table">
                        <thead>
                            <tr>
                                <th>Question</th>
                                <th>Views</th>
                                <th>Completions</th>
                                <th>Drop-off Rate</th>
                                <th>Avg. Time</th>
                                <th>Performance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questionAnalytics.map((q) => (
                                <tr key={q.id}>
                                    <td className="form-insights-question-cell">
                                        <span className="form-insights-question-number">Q{q.id}</span>
                                        {q.question}
                                    </td>
                                    <td>{q.views.toLocaleString()}</td>
                                    <td>{q.completions.toLocaleString()}</td>
                                    <td>
                                        <span className={`form-insights-drop-off-rate ${q.dropOffRate > 20 ? 'form-insights-high-drop-off' : ''}`}>
                                            {q.dropOffRate}%
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
            <ProFeatureBanner featureName="Advanced Entries" addonSlug="advancedentries" />
        </div>
    );
};

export default DropOffAnalyticsDemo;