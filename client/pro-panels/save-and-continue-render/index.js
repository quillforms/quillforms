import React, { useState, useEffect } from 'react';
import { EnhancedProLabel, ProFeatureBanner } from "@quillforms/admin-components";
import { motion, AnimatePresence } from 'framer-motion';
import { __ } from '@wordpress/i18n';
import "./style.css";

const SaveContinuePromo = () => {
    const [step, setStep] = useState(1);

    useEffect(() => {
        const timer = setInterval(() => {
            setStep(prev => (prev % 3) + 1);
        }, 3000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="save-continue-container">
            <EnhancedProLabel />

            <h1 className="save-continue-title">{__('Save & Continue Later', 'quillforms')}</h1>
            <p className="save-continue-subtitle">
                {__('Let users save their progress and continue from any device', 'quillforms')}
            </p>

            <div className="save-continue-demo">
                <div className="save-continue-flow">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                className="save-continue-step"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                            >
                                <div className="save-continue-form-setup">
                                    <div className="save-continue-setup-header">
                                        {__('Form Setup', 'quillforms')}
                                    </div>
                                    <div className="save-continue-field-required">
                                        <div className="save-continue-field-icon">✉️</div>
                                        <div className="save-continue-field-details">
                                            <h4>{__('Email Field Required', 'quillforms')}</h4>
                                            <p>{__('Add an email field to enable Save & Continue', 'quillforms')}</p>
                                        </div>
                                        <div className="save-continue-field-status">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#34A853" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                className="save-continue-step"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                            >
                                <div className="save-continue-form">
                                    <div className="save-continue-progress">
                                        <div className="save-continue-progress-bar" style={{ width: '60%' }}></div>
                                        <span className="save-continue-progress-text">{__('Progress:', 'quillforms')} 60%</span>
                                    </div>

                                    <div className="save-continue-form-fields">
                                        <div className="save-continue-form-field">
                                            <label>{__('Email Address', 'quillforms')}</label>
                                            <input type="email" value="user@example.com" readOnly />
                                        </div>
                                        {/* Other form fields simulation */}
                                        <div className="save-continue-form-field-placeholder"></div>
                                        <div className="save-continue-form-field-placeholder"></div>
                                    </div>

                                    <button className="save-continue-save-button">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M15 6v8H5V6h10m0-2H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" fill="currentColor" />
                                            <path d="M10 13l-3-3h6l-3 3z" fill="currentColor" />
                                        </svg>
                                        {__('Save & Continue Later', 'quillforms')}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                className="save-continue-step"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                            >
                                <div className="save-continue-email-sent">
                                    <div className="save-continue-email-preview">
                                        <div className="save-continue-email-header">
                                            <div className="save-continue-email-subject">
                                                {__('Continue Your Form', 'quillforms')}
                                            </div>
                                            <div className="save-continue-email-meta">
                                                {__('Sent to:', 'quillforms')} user@example.com
                                            </div>
                                        </div>
                                        <div className="save-continue-email-body">
                                            <p>{__('Hello!', 'quillforms')}</p>
                                            <p>{__('Click the button below to continue your form where you left off:', 'quillforms')}</p>
                                            <button className="save-continue-resume-button">
                                                {__('Continue Form', 'quillforms')}
                                            </button>
                                            <p className="save-continue-email-note">
                                                {__('Your progress has been saved. You can continue from any device.', 'quillforms')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="save-continue-features">
                    <div className="save-continue-feature">
                        <div className="save-continue-feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" fill="#1a73e8" />
                            </svg>
                        </div>
                        <h3 className="save-continue-feature-title">{__('Use Form Email', 'quillforms')}</h3>
                        <p className="save-continue-feature-desc">
                            {__('Uses email field from your form - no extra popups needed', 'quillforms')}
                        </p>
                    </div>

                    <div className="save-continue-feature">
                        <div className="save-continue-feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z" fill="#1a73e8" />
                            </svg>
                        </div>
                        <h3 className="save-continue-feature-title">{__('One-Click Save', 'quillforms')}</h3>
                        <p className="save-continue-feature-desc">
                            {__('Users can save their progress with a single click', 'quillforms')}
                        </p>
                    </div>

                    <div className="save-continue-feature">
                        <div className="save-continue-feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM9 10h6v2H9v-2z" fill="#1a73e8" />
                            </svg>
                        </div>
                        <h3 className="save-continue-feature-title">{__('Any Device', 'quillforms')}</h3>
                        <p className="save-continue-feature-desc">
                            {__('Continue form completion from any device, anywhere', 'quillforms')}
                        </p>
                    </div>
                </div>
                {/* 
                <div className="save-continue-upgrade-prompt">
                    <div className="save-continue-upgrade-content">
                        <div className="save-continue-upgrade-icon">🚀</div>
                        <h3 className="save-continue-upgrade-title">Upgrade to Pro</h3>
                        <p className="save-continue-upgrade-desc">
                            Enable Save & Continue feature and let users complete forms at their convenience
                        </p>
                        <button className="save-continue-upgrade-button">
                            Unlock Save & Continue
                        </button>
                    </div>
                </div> */}
            </div>

            <ProFeatureBanner
                featureName={__('Save & Continue', 'quillforms')}
                addonSlug="saveandcontinue"
            />
        </div>
    );
};

export default SaveContinuePromo;