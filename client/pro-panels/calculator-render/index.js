// CalculatorFeaturePromo.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProFeatureBanner } from "@quillforms/admin-components";
import { __ } from '@wordpress/i18n';
import './style.css';

const CalculatorFeaturePromo = () => {
	const [activeFeature, setActiveFeature] = useState('math');
	const [activeStep, setActiveStep] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setActiveFeature(prev => prev === 'math' ? 'points' : 'math');
		}, 6000);

		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		const stepTimer = setInterval(() => {
			setActiveStep(prev => (prev + 1) % 3);
		}, 2000);

		return () => clearInterval(stepTimer);
	}, []);

	return (
		<div className="calculator-feature-container">
			<h1 className="calculator-feature-title">{__('Unlock Advanced Calculations', 'quillforms')}</h1>
			<p className="calculator-feature-subtitle">{__('Transform your forms into powerful calculation tools', 'quillforms')}</p>

			<div className="calculator-feature-animation-container">
				<AnimatePresence mode="wait">
					{activeFeature === 'math' ? (
						<motion.div
							className="calculator-feature-section"
							key="math"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 20 }}
							transition={{ duration: 0.5 }}
						>
							<div className="calculator-feature-icon">
								<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
									<rect width="48" height="48" rx="24" fill="#E3F2FD" />
									<path d="M24 12v24M12 24h24" stroke="#2196F3" strokeWidth="4" strokeLinecap="round" />
								</svg>
							</div>
							<h2 className="calculator-feature-section-title">{__('Mathematical Operations', 'quillforms')}</h2>
							<p className="calculator-feature-section-description">
								{__('Add values to variables based on form responses and conditions. Perfect for dynamic pricing, scoring, and calculations.', 'quillforms')}
							</p>

							<div className="calculator-feature-example">
								<div className="calculator-feature-math-flow">
									<div className={`calculator-feature-step ${activeStep === 0 ? 'active' : ''}`}>
										<div className="calculator-feature-question">
											{__('What is your package size?', 'quillforms')}
										</div>
										<div className="calculator-feature-answer">
											{__('Large Package Selected', 'quillforms')}
										</div>
									</div>
									<div className={`calculator-feature-step ${activeStep === 1 ? 'active' : ''}`}>
										<div className="calculator-feature-condition">
											{__('If "Large Package" is selected:', 'quillforms')}
										</div>
									</div>
									<div className={`calculator-feature-step ${activeStep === 2 ? 'active' : ''}`}>
										<div className="calculator-feature-action">
											{__('Add', 'quillforms')} <span className="calculator-feature-value">50</span> {__('to', 'quillforms')}
											<span className="calculator-feature-variable">{__('Shipping_Cost', 'quillforms')}</span>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					) : (
						<motion.div
							className="calculator-feature-section"
							key="points"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 20 }}
							transition={{ duration: 0.5 }}
						>
							<div className="calculator-feature-icon">
								<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
									<rect width="48" height="48" rx="24" fill="#E8F5E9" />
									<path d="M24 12l12 6-12 6-12-6 12-6z" fill="#4CAF50" />
									<path d="M24 30l12-6v6l-12 6-12-6v-6l12 6z" fill="#4CAF50" />
								</svg>
							</div>
							<h2 className="calculator-feature-section-title">{__('Points System', 'quillforms')}</h2>
							<p className="calculator-feature-section-description">
								{__('Assign points to multiple-choice options. Automatically calculate total scores based on responses.', 'quillforms')}
							</p>

							<div className="calculator-feature-example">
								<div className="calculator-feature-points-flow">
									<div className="calculator-feature-question-title">
										{__('Knowledge Check Question', 'quillforms')}
									</div>
									<div className="calculator-feature-points">
										<div className="calculator-feature-option">
											<span className="calculator-feature-option-text">{__('Correct Answer', 'quillforms')}</span>
											<span className="calculator-feature-points-value">{__('+10 points', 'quillforms')}</span>
										</div>
										<div className="calculator-feature-option">
											<span className="calculator-feature-option-text">{__('Partial Answer', 'quillforms')}</span>
											<span className="calculator-feature-points-value">{__('+5 points', 'quillforms')}</span>
										</div>
										<div className="calculator-feature-option">
											<span className="calculator-feature-option-text">{__('Wrong Answer', 'quillforms')}</span>
											<span className="calculator-feature-points-value">{__('+0 points', 'quillforms')}</span>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<ProFeatureBanner
				featureName={__('Calculator and Points', 'quillforms')}
				addonSlug="logic"
			/>
		</div>
	);
};

export default CalculatorFeaturePromo;