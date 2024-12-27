import "./style.css";
import { EnhancedProLabel, ProFeatureBanner } from "@quillforms/admin-components";
const JumpLogicPreview = () => {
	return (
		<div className="jump-logic-preview-wrapper">
			<div className="jump-logic-preview-content">
				<div className="jump-logic-preview-left">
					<div className="jump-logic-preview-header">
						<EnhancedProLabel />
						<h2>Smart Jump Logic</h2>
						<p className="jump-logic-preview-subtitle">Create conditional paths by dragging between fields</p>
					</div>
					<div className="jump-logic-preview-features">
						<div className="jump-logic-preview-feature">
							<span className="jump-logic-preview-checkmark">✓</span>
							Drag & Drop Interface
						</div>
						<div className="jump-logic-preview-feature">
							<span className="jump-logic-preview-checkmark">✓</span>
							Skip Irrelevant Questions
						</div>
						<div className="jump-logic-preview-feature">
							<span className="jump-logic-preview-checkmark">✓</span>
							Personalized Form Paths
						</div>
					</div>

					<ProFeatureBanner
						featureName="Jump Logic"
						addonSlug="logic"
					/>
				</div>

				<div className="jump-logic-preview-right">
					<svg viewBox="0 0 400 500" className="jump-logic-preview-illustration">
						<defs>
							<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
								<stop offset="0%" style={{ stopColor: '#f8fafc', stopOpacity: 1 }} />
								<stop offset="100%" style={{ stopColor: '#eff6ff', stopOpacity: 1 }} />
							</linearGradient>

							<filter id="glow">
								<feGaussianBlur stdDeviation="2" result="coloredBlur" />
								<feMerge>
									<feMergeNode in="coloredBlur" />
									<feMergeNode in="SourceGraphic" />
								</feMerge>
							</filter>

							{/* Grab handle pattern */}
							<pattern id="grabHandle" width="12" height="12" patternUnits="userSpaceOnUse">
								<circle cx="2" cy="2" r="1.5" fill="#0066cc" opacity="0.5" />
								<circle cx="2" cy="6" r="1.5" fill="#0066cc" opacity="0.5" />
								<circle cx="2" cy="10" r="1.5" fill="#0066cc" opacity="0.5" />
							</pattern>
						</defs>

						<rect width="100%" height="100%" fill="url(#bgGrad)" />

						{/* Form Fields */}
						<g className="jump-logic-preview-fields">
							{/* Field 1 */}
							<g className="jump-logic-preview-field" transform="translate(50, 50)">
								<rect
									width="300"
									height="80"
									rx="8"
									fill="white"
									stroke="#0066cc"
									strokeWidth="2"
								/>
								<text x="20" y="35" fill="#1a1a1a" fontSize="16">What's your role?</text>
								<g className="jump-logic-preview-options" transform="translate(20, 45)">
									<text x="0" y="20" fill="#666666" fontSize="14">○ Manager</text>
									<text x="100" y="20" fill="#666666" fontSize="14">○ Employee</text>
								</g>
							</g>

							{/* Field 2 (Middle - Skipped) */}
							<g
								className="jump-logic-preview-field"
								transform="translate(50, 180)"
							>
								<rect
									width="300"
									height="80"
									rx="12"
									fill="white"
									stroke="#ccc"
									strokeDasharray="4"
									strokeWidth="2"
								/>
								<text x="20" y="35" fill="#a1a1a1" fontSize="16">
									Years of experience?
								</text>
								<text x="20" y="60" fill="#a1a1a1" fontSize="14">
									(Skipped based on condition)
								</text>
							</g>

							{/* Field 3 */}
							<g className="jump-logic-preview-field" transform="translate(50, 310)">
								<rect
									width="300"
									height="80"
									rx="8"
									fill="white"
									stroke="#0066cc"
									strokeWidth="2"
								/>
								<text x="20" y="35" fill="#1a1a1a" fontSize="16">Team size?</text>
								<g className="jump-logic-preview-options" transform="translate(20, 45)">
									<text x="0" y="20" fill="#666666" fontSize="14">○ 1-10</text>
									<text x="80" y="20" fill="#666666" fontSize="14">○ 11-50</text>
									<text x="160" y="20" fill="#666666" fontSize="14">○ 50+</text>
								</g>
							</g>

							{/* Curved Path Animation */}
							<path
								className="jump-logic-preview-connection-path"
								d="M340 90 C 480 90, 480 350, 340 350"
								stroke="#0066cc"
								strokeWidth="2"
								fill="none"
							/>

							{/* Arrow marker definition */}
							<defs>
								<marker
									id="arrowhead"
									markerWidth="10"
									markerHeight="7"
									refX="9"
									refY="3.5"
									orient="auto">
									<path
										d="M0 0 L10 3.5 L0 7 L2 3.5 Z"
										fill="#0066cc"
									/>
								</marker>
							</defs>

							{/* Condition Indicator */}
							{/* Condition Indicator */}
							<g className="jump-logic-preview-condition" transform="translate(380, 220)">
								<circle r="16" fill="white" stroke="#0066cc" strokeWidth="2" />
								<text
									x="0"
									y="1"
									fontSize="12"
									textAnchor="middle"
									fill="#0066cc"
									className="jump-logic-preview-condition-icon"
								>IF</text>

								{/* Condition Popup */}
								<g className="jump-logic-preview-condition-popup" transform="translate(30, 0)">
									<rect
										width="120"
										height="60"
										rx="6"
										fill="white"
										stroke="#0066cc"
										strokeWidth="1"
									/>
									<text x="10" y="20" fontSize="12" fill="#666666">If Role is</text>
									<text x="10" y="40" fontSize="14" fill="#1a1a1a" fontWeight="500">Manager</text>
								</g>
							</g>

							{/* Animated Cursor with Grab Icon */}
							<g className="jump-logic-preview-cursor">
								<circle r="12" fill="#0066cc" opacity="0.2" />
								<circle r="8" fill="#0066cc" />
								<path
									d="M-4 0 L4 0 M0 -4 L0 4"
									stroke="white"
									strokeWidth="2"
									className="jump-logic-preview-cursor-plus"
								/>
							</g>

						</g>
					</svg>
				</div>
			</div>
		</div>
	);
}

export default JumpLogicPreview;