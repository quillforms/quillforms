import "./style.css";
import { useState } from "react";
const DropOffAnalyticsDemo = () => {
    const [showDemoInfo, setShowDemoInfo] = useState(true);

    return (
        <div className="analytics-demo">
            {/* Demo Overlay - shows initially and can be toggled */}
            {showDemoInfo && (
                <div className="demo-overlay">
                    <div className="demo-overlay-content">
                        <span className="demo-overlay-icon">🎯</span>
                        <h3>Demo Preview</h3>
                        <p>This is a demonstration of the Form Analytics feature using sample data.</p>
                        <p>Upgrade to Pro to access real-time analytics for your forms.</p>
                        <button
                            className="demo-overlay-button"
                            onClick={() => setShowDemoInfo(false)}
                        >
                            Explore Demo
                        </button>
                    </div>
                </div>
            )}
            {/* Permanent Demo Watermark */}
            <div className="demo-watermark">
                <div className="demo-watermark-text">
                    DEMO PREVIEW
                </div>
            </div>

            {/* Demo Controls */}
            <div className="demo-controls">
                <button
                    className="demo-info-button"
                    onClick={() => setShowDemoInfo(true)}
                >
                    <span>ℹ️</span> About This Demo
                </button>
            </div>

            <div className="demo-badge">
                <span className="demo-badge-icon">⭐</span> Pro Feature Demo
            </div>

            <h2>Form Analytics & Drop-off Tracking</h2>
            <p className="demo-subtitle">See where users drop off and optimize your form completion rate</p>

            <div className="funnel-visualization">
                <svg viewBox="0 0 400 300" className="funnel-svg">
                    {/* Funnel Shape */}
                    <path
                        className="funnel-path"
                        d="M50,10 L350,10 L300,290 L100,290 Z"
                        fill="#f1f3f4"
                    />

                    {/* Animated Flow Lines */}
                    <path
                        className="flow-line"
                        d="M200,10 L200,290"
                        stroke="#1a73e8"
                        strokeDasharray="4,4"
                    />

                    {/* Stage Markers */}
                    <g className="stage" transform="translate(200,60)">
                        <circle r="8" fill="#34a853" />
                        <text x="60" y="5" className="stage-text">Started (1000)</text>
                    </g>

                    <g className="stage" transform="translate(200,150)">
                        <circle r="8" fill="#fbbc04" />
                        <text x="60" y="5" className="stage-text">In Progress (650)</text>
                    </g>

                    <g className="stage" transform="translate(200,240)">
                        <circle r="8" fill="#ea4335" />
                        <text x="60" y="5" className="stage-text">Completed (325)</text>
                    </g>

                    {/* Animated Dots */}
                    <circle className="moving-dot dot1" r="4" fill="#1a73e8" />
                    <circle className="moving-dot dot2" r="4" fill="#1a73e8" />
                    <circle className="moving-dot dot3" r="4" fill="#1a73e8" />
                </svg>

                <div className="analytics-insights">
                    <div className="insight-item">
                        <span className="insight-icon">📉</span>
                        <div className="insight-content">
                            <strong>32.5% Completion Rate</strong>
                            <span>Form performance needs optimization</span>
                        </div>
                    </div>
                    <div className="insight-item">
                        <span className="insight-icon">⏱️</span>
                        <div className="insight-content">
                            <strong>4.5 min Average Time</strong>
                            <span>Consider simplifying longer sections</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="upgrade-section">
                <button className="upgrade-button">
                    <span className="upgrade-icon">⭐</span>
                    Upgrade to Pro
                </button>
                <p className="upgrade-note">Get access to detailed form analytics and insights</p>
            </div>
        </div>
    );
};
export default DropOffAnalyticsDemo;