// CalculatorFeaturePromo.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
			<h1 className="calculator-feature-title">Unlock Advanced Calculations</h1>
			<p className="calculator-feature-subtitle">Transform your forms into powerful calculation tools</p>

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
							<h2 className="calculator-feature-section-title">Mathematical Operations</h2>
							<p className="calculator-feature-section-description">
								Add values to variables based on form responses and conditions. Perfect for dynamic pricing, scoring, and calculations.
							</p>

							<div className="calculator-feature-example">
								<div className="calculator-feature-math-flow">
									<div className={`calculator-feature-step ${activeStep === 0 ? 'active' : ''}`}>
										<div className="calculator-feature-question">
											What is your package size?
										</div>
										<div className="calculator-feature-answer">
											Large Package Selected
										</div>
									</div>
									<div className={`calculator-feature-step ${activeStep === 1 ? 'active' : ''}`}>
										<div className="calculator-feature-condition">
											If "Large Package" is selected:
										</div>
									</div>
									<div className={`calculator-feature-step ${activeStep === 2 ? 'active' : ''}`}>
										<div className="calculator-feature-action">
											Add <span className="calculator-feature-value">50</span> to
											<span className="calculator-feature-variable">Shipping_Cost</span>
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
							<h2 className="calculator-feature-section-title">Points System</h2>
							<p className="calculator-feature-section-description">
								Assign points to multiple-choice options. Automatically calculate total scores based on responses.
							</p>

							<div className="calculator-feature-example">
								<div className="calculator-feature-points-flow">
									<div className="calculator-feature-question-title">
										Knowledge Check Question
									</div>
									<div className="calculator-feature-points">
										<div className="calculator-feature-option">
											<span className="calculator-feature-option-text">Correct Answer</span>
											<span className="calculator-feature-points-value">+10 points</span>
										</div>
										<div className="calculator-feature-option">
											<span className="calculator-feature-option-text">Partial Answer</span>
											<span className="calculator-feature-points-value">+5 points</span>
										</div>
										<div className="calculator-feature-option">
											<span className="calculator-feature-option-text">Wrong Answer</span>
											<span className="calculator-feature-points-value">+0 points</span>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<button className="calculator-feature-upgrade-button">
				Upgrade to Pro
			</button>
		</div>
	);
};

export default CalculatorFeaturePromo;