import { useState } from "react";
import "./style.css";

const FormAnalyticsDemo = () => {
    const [showDemoOverlay, setShowDemoOverlay] = useState(true);

    const questionData = [
        {
            question: "What's your preferred working schedule?",
            total: 1000,
            options: [
                { label: "9-5 Office Hours", percentage: 45, color: "#4285f4" },
                { label: "Flexible Hours", percentage: 30, color: "#34a853" },
                { label: "Night Shift", percentage: 15, color: "#fbbc04" },
                { label: "Weekend Shifts", percentage: 10, color: "#ea4335" }
            ]
        },
        {
            question: "How often do you work remotely?",
            total: 850,
            options: [
                { label: "Full Remote", percentage: 35, color: "#4285f4" },
                { label: "Hybrid (3-2)", percentage: 40, color: "#34a853" },
                { label: "Occasional", percentage: 15, color: "#fbbc04" },
                { label: "Office Only", percentage: 10, color: "#ea4335" }
            ]
        }
    ];

    return (
        <div className="form-analytics-container">
            {showDemoOverlay && (
                <div className="form-analytics-demo-overlay">
                    <div className="form-analytics-demo-overlay-content">
                        <span className="form-analytics-demo-overlay-icon">📊</span>
                        <h3>Form Analytics Demo</h3>
                        <p>See how respondents answer your multiple choice questions with interactive charts and insights.</p>
                        <p>This is a preview using sample data.</p>
                        <button
                            className="form-analytics-demo-overlay-button"
                            onClick={() => setShowDemoOverlay(false)}
                        >
                            Explore Analytics Demo
                        </button>
                    </div>
                </div>
            )}

            <div className="form-analytics-demo-watermark">DEMO PREVIEW</div>

            <div className="form-analytics-demo-header">
                <div className="form-analytics-pro-badge">
                    <span>⭐</span> Pro Feature
                </div>
                <h2>Response Analytics</h2>
                <p>Analyze how people respond to your multiple choice questions</p>
            </div>

            <div className="form-analytics-questions-grid">
                {questionData.map((question, qIndex) => (
                    <div className="form-analytics-question-card" key={qIndex}>
                        <div className="form-analytics-question-header">
                            <h3>{question.question}</h3>
                            <div className="form-analytics-total-responses">
                                {question.total} responses
                            </div>
                        </div>

                        <div className="form-analytics-chart-container">
                            <svg className="form-analytics-donut-chart" viewBox="0 0 200 200">
                                {question.options.map((option, index) => {
                                    const startAngle = question.options
                                        .slice(0, index)
                                        .reduce((sum, opt) => sum + opt.percentage, 0) * 3.6;
                                    const angle = option.percentage * 3.6;

                                    return (
                                        <path
                                            key={index}
                                            className="form-analytics-chart-segment"
                                            d={describeArc(100, 100, 80, startAngle, startAngle + angle)}
                                            fill={option.color}
                                        >
                                            <animate
                                                attributeName="opacity"
                                                from="0"
                                                to="1"
                                                dur="1s"
                                                begin={`${index * 0.2}s`}
                                                fill="freeze"
                                            />
                                        </path>
                                    );
                                })}
                                <circle cx="100" cy="100" r="60" fill="white" />
                                <text x="100" y="100" textAnchor="middle" dy=".3em" className="form-analytics-chart-total">
                                    {question.total}
                                </text>
                            </svg>

                            <div className="form-analytics-chart-legend">
                                {question.options.map((option, index) => (
                                    <div className="form-analytics-legend-item" key={index}>
                                        <span
                                            className="form-analytics-legend-color"
                                            style={{ background: option.color }}
                                        ></span>
                                        <span className="form-analytics-legend-label">{option.label}</span>
                                        <span className="form-analytics-legend-percentage">{option.percentage}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="form-analytics-question-insights">
                            <div className="form-analytics-insight-icon">💡</div>
                            <div className="form-analytics-insight-content">
                                Most respondents prefer {
                                    question.options.reduce((prev, current) =>
                                        prev.percentage > current.percentage ? prev : current
                                    ).label.toLowerCase()
                                }
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="form-analytics-demo-footer">
                <button
                    className="form-analytics-demo-info-button"
                    onClick={() => setShowDemoOverlay(true)}
                >
                    ℹ️ About This Demo
                </button>
                <button className="form-analytics-upgrade-button">
                    <span>⭐</span> Upgrade to Pro
                </button>
            </div>
        </div>
    );
};

// Helper functions remain the same
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
    };
}

function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
        "M",
        start.x,
        start.y,
        "A",
        radius,
        radius,
        0,
        largeArcFlag,
        0,
        end.x,
        end.y,
        "L",
        x,
        y,
        "L",
        start.x,
        start.y,
    ].join(" ");
}

export default FormAnalyticsDemo;