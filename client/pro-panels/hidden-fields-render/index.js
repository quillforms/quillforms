// UTMParametersPromo.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProFeatureBanner } from "@quillforms/admin-components";

import './style.css';

const UTMParametersPromo = () => {
	const [activeTab, setActiveTab] = useState('hidden');
	const [urlType, setUrlType] = useState('query');

	return (
		<div className="utm-feature-container">
			<h1 className="utm-feature-title">Advanced URL Parameter Tracking</h1>
			<p className="utm-feature-subtitle">Capture and track URL parameters effortlessly</p>

			<div className="utm-feature-tabs">
				<button
					className={`utm-feature-tab ${activeTab === 'hidden' ? 'active' : ''}`}
					onClick={() => setActiveTab('hidden')}
				>
					Hidden Fields
				</button>
				<button
					className={`utm-feature-tab ${activeTab === 'utm' ? 'active' : ''}`}
					onClick={() => setActiveTab('utm')}
				>
					UTM Parameters
				</button>
			</div>

			<div className="utm-feature-content">
				<AnimatePresence mode="wait">
					{activeTab === 'hidden' ? (
						<motion.div
							key="hidden"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							className="utm-feature-section"
						>
							<div className="utm-feature-url-demo">
								<div className="utm-feature-url-toggle">
									<button
										className={`utm-feature-url-type ${urlType === 'query' ? 'active' : ''}`}
										onClick={() => setUrlType('query')}
									>
										Query String
									</button>
									<button
										className={`utm-feature-url-type ${urlType === 'hash' ? 'active' : ''}`}
										onClick={() => setUrlType('hash')}
									>
										Hash
									</button>
								</div>

								<div className="utm-feature-url-display">
									<span className="utm-feature-url-base">example.com</span>
									<span className="utm-feature-url-separator">{urlType === 'query' ? '?' : '#'}</span>
									<span className="utm-feature-url-param">username</span>
									<span className="utm-feature-url-equals">=</span>
									<span className="utm-feature-url-value">john</span>
								</div>

								<motion.div
									className="utm-feature-capture-arrow"
									animate={{ y: [0, 10, 0] }}
									transition={{ duration: 2, repeat: Infinity }}
								>
									↓
								</motion.div>

								<div className="utm-feature-hidden-field">
									<div className="utm-feature-field-label">Hidden Field</div>
									<div className="utm-feature-field-key">username</div>
									<div className="utm-feature-field-value">john</div>
								</div>
							</div>
						</motion.div>
					) : (
						<motion.div
							key="utm"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							className="utm-feature-section"
						>
							<div className="utm-feature-utm-showcase">
								<div className="utm-feature-utm-flow">
									<div className="utm-feature-url-example">
										<div className="utm-feature-url-label">Marketing Campaign URL</div>
										<div className="utm-feature-url-content">
											<span className="utm-base">example.com?</span>
											<span className="utm-param">utm_source</span>=<span className="utm-value">google</span>&
											<span className="utm-param">utm_medium</span>=<span className="utm-value">cpc</span>&
											<span className="utm-param">utm_campaign</span>=<span className="utm-value">spring_sale</span>
										</div>
									</div>

									<div className="utm-feature-arrow">
										<motion.svg
											width="24"
											height="64"
											viewBox="0 0 24 64"
											fill="none"
											animate={{ y: [0, 10, 0] }}
											transition={{ duration: 2, repeat: Infinity }}
										>
											<path d="M12 0v60m-8-8l8 8 8-8" stroke="#1a73e8" strokeWidth="2" />
										</motion.svg>
									</div>

									<div className="utm-feature-tracking-card">
										<div className="utm-feature-card-header">
											Campaign Tracking Data
										</div>
										<div className="utm-feature-tracking-data">
											<div className="utm-feature-data-item">
												<div className="utm-feature-data-icon">
													<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
														<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="#1a73e8" />
													</svg>
												</div>
												<div className="utm-feature-data-content">
													<div className="utm-feature-data-label">Source</div>
													<div className="utm-feature-data-value">google</div>
												</div>
											</div>
											<div className="utm-feature-data-item">
												<div className="utm-feature-data-icon">
													<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
														<path d="M3 3h18v18H3V3zm16 16V5H5v14h14z" fill="#1a73e8" />
													</svg>
												</div>
												<div className="utm-feature-data-content">
													<div className="utm-feature-data-label">Medium</div>
													<div className="utm-feature-data-value">cpc</div>
												</div>
											</div>
											<div className="utm-feature-data-item">
												<div className="utm-feature-data-icon">
													<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
														<path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12z" fill="#1a73e8" />
													</svg>
												</div>
												<div className="utm-feature-data-content">
													<div className="utm-feature-data-label">Campaign</div>
													<div className="utm-feature-data-value">spring_sale</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className="utm-feature-benefits">
									<div className="utm-feature-benefit">
										<div className="utm-feature-benefit-icon">📊</div>
										<div className="utm-feature-benefit-title">Track Marketing Success</div>
										<div className="utm-feature-benefit-desc">
											Capture UTM parameters to measure campaign effectiveness
										</div>
									</div>
									<div className="utm-feature-benefit">
										<div className="utm-feature-benefit-icon">🔄</div>
										<div className="utm-feature-benefit-title">Automatic Detection</div>
										<div className="utm-feature-benefit-desc">
											Automatically captures UTM parameters from incoming traffic
										</div>
									</div>
									<div className="utm-feature-benefit">
										<div className="utm-feature-benefit-icon">📈</div>
										<div className="utm-feature-benefit-title">Marketing Analytics</div>
										<div className="utm-feature-benefit-desc">
											Connect form submissions to your marketing campaigns
										</div>
									</div>
								</div>
							</div>
						</motion.div>

					)}
				</AnimatePresence>
			</div>

			<ProFeatureBanner
				featureName="URL Parameters Tracking"
				addonSlug="hiddenfields"
			/>
		</div>
	);
};

export default UTMParametersPromo;