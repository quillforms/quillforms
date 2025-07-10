/**
 * QuillForms AI Generation Component - WordPress Proxy Version
 * Uses WordPress backend as proxy to avoid CORS issues
 */

import { Button, TextControl } from '@quillforms/admin-components';
import { getHistory, getNewPath } from '@quillforms/navigation';
import { useEffect, useRef, useState, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { css } from 'emotion';
import AiIcon from './ai-icon';
import StarIcon from './stars-icon';
import LoadingIcon from './loading-icon';
import { useSelect } from '@wordpress/data';
import { keys } from 'lodash';

const GenerateAiForm = ({
	closeModal,
	setCanProceed,
	setNextButtonText,
	setNextButtonAction,
	setIsLoading,
}) => {
	const [description, setDescription] = useState('');
	const [formType, setFormType] = useState('');
	const [industry, setIndustry] = useState('');
	const [complexity, setComplexity] = useState('Medium');
	const [additionalInstructions, setAdditionalInstructions] = useState('');
	const [showLoader, setShowLoader] = useState(false);
	const [error, setError] = useState('');
	const [isGenerating, setIsGenerating] = useState(false);

	const descriptionRef = useRef(null);
	const { blockTypes } = useSelect((select) => {
		return {
			blockTypes: select('quillForms/blocks').getBlockTypes(),
		};
	}, []);

	const availableBlockTypes = keys(blockTypes).filter((blockTypeName) => blockTypeName !== 'quill-booking');

	useEffect(() => {
		if (descriptionRef?.current) {
			descriptionRef.current.focus();
		}
	}, []);

	// FIXED: Use useCallback to prevent infinite re-renders
	const generateAiForm = useCallback(async () => {

		if (isGenerating) {
			return;
		}

		setIsGenerating(true);
		setIsLoading(true);
		setShowLoader(true);
		setError('');

		try {
			// Prepare the request payload
			const requestData = {
				prompt: description.trim(),
				complexity: complexity,
			};

			// Add optional fields only if they have values
			if (formType?.trim()) {
				requestData.formType = formType.trim();
			}

			if (industry?.trim()) {
				requestData.industry = industry.trim();
			}

			if (additionalInstructions?.trim()) {
				requestData.additionalInstructions = additionalInstructions.trim();
			}

			requestData['availableBlocks'] = availableBlockTypes;
			console.log('🚀 requestData:', requestData);

			// // Use WordPress apiFetch to call the AI endpoint
			const result = await apiFetch({
				path: '/qf/v1/ai/generate',
				method: 'POST',
				data: requestData,
			});



			if (!result.success) {
				throw new Error(result.error || result.message || 'Failed to generate form');
			}

			console.log('✅ AI form generated successfully:', result);

			// Create the form using the generated data
			await createFormFromAiResponse(result.form || result.data);

		} catch (error) {
			console.error('❌ Error generating AI form:', error);

			// Provide helpful error messages
			let errorMessage = error.message;

			// Check if it's a WordPress REST API error
			if (error.code) {
				switch (error.code) {
					case 'quillforms_ai_connection_error':
						errorMessage = 'Unable to connect to AI service. Please check your internet connection.';
						break;
					case 'quillforms_ai_service_error':
						if (errorMessage.includes('Too many requests')) {
							errorMessage = 'Too many requests. Please wait a moment and try again.';
						}
						break;
					case 'quillforms_ai_generation_failed':
						// Use the error message as is
						break;
					case 'rest_forbidden':
						errorMessage = 'Permission denied. Please check your user permissions.';
						break;
					default:
						// Use the error message as is
						break;
				}
			}

			setError(errorMessage);
		} finally {
			setIsGenerating(false);
			setIsLoading(false);
			setShowLoader(false);
		}
	}, [description, complexity, formType, industry, additionalInstructions, isGenerating, setIsLoading]);

	const createFormFromAiResponse = useCallback(async (formData) => {
		try {
			// Prepare the form data for WordPress
			const wpFormData = {
				title: formData.title || 'AI Generated Form',
				status: 'publish',
				blocks: formData.blocks || [],
			};

			// Include form settings if available
			// if (formData.settings) {
			// 	wpFormData.settings = formData.settings;
			// }


			// Use WordPress apiFetch to create the form
			const createdForm = await apiFetch({
				path: '/wp/v2/quill_forms',
				method: 'POST',
				data: wpFormData,
			});


			// Navigate to the form builder
			const { id } = createdForm;
			getHistory().push(getNewPath({}, `/forms/${id}/builder`));

		} catch (error) {
			console.error('💥 Error creating form:', error);
			throw new Error('Failed to create form: ' + error.message);
		}
	}, []);

	// FIXED: Update parent component's next button state - prevent infinite loop
	useEffect(() => {
		console.log('🔄 Updating parent state (one time)...', {
			descriptionLength: description.trim().length,
			isGenerating,
			canProceed: description.trim().length >= 5 && !isGenerating
		});

		const canProceed = description.trim().length >= 5 && !isGenerating;
		setCanProceed(canProceed);
		setNextButtonText(__('Generate Form ✨', 'quillforms'));
		setNextButtonAction(generateAiForm);

	}, [description, isGenerating]);

	// Enhanced loading screen
	if (showLoader) {
		return (
			<div
				className={css`
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					z-index: 999999;
				`}
			>
				<div
					className={css`
						position: absolute;
						top: -2rem;
						left: 0;
						right: 0;
						bottom: -2rem;
						background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						z-index: 1000;
						border-radius: 12px;
					`}
				>
					{/* Floating animation shapes */}
					<div
						className={css`
							position: absolute;
							width: 100%;
							height: 100%;
							overflow: hidden;
							opacity: 0.05;
						`}
					>
						{[...Array(6)].map((_, i) => (
							<div
								key={i}
								className={css`
									position: absolute;
									background: linear-gradient(45deg, #8b5cf6, #06b6d4);
									border-radius: 50%;
									animation: float 6s ease-in-out infinite;
									animation-delay: ${i * 0.8}s;

									${i === 0 && `width: 60px; height: 60px; top: 10%; left: 10%;`}
									${i === 1 && `width: 80px; height: 80px; top: 20%; right: 15%;`}
									${i === 2 && `width: 40px; height: 40px; bottom: 30%; left: 20%;`}
									${i === 3 && `width: 100px; height: 100px; bottom: 20%; right: 10%;`}
									${i === 4 && `width: 50px; height: 50px; top: 50%; left: 5%;`}
									${i === 5 && `width: 70px; height: 70px; top: 60%; right: 5%;`}

									@keyframes float {
										0%, 100% {
											transform: translateY(0px) rotate(0deg);
										}
										50% {
											transform: translateY(-30px) rotate(180deg);
										}
									}
								`}
							/>
						))}
					</div>

					{/* Main loading content */}
					<div
						className={css`
							display: flex;
							flex-direction: column;
							align-items: center;
							gap: 2rem;
							text-align: center;
							z-index: 1;
							max-width: 500px;
							padding: 0 2rem;
						`}
					>
						<LoadingIcon />

						<div
							className={css`
								display: flex;
								align-items: center;
								gap: 1rem;
							`}
						>
							<div
								className={css`
									width: 24px;
									height: 24px;
									border: 3px solid #e3e3e3;
									border-top: 3px solid #8b5cf6;
									border-radius: 50%;
									animation: spin 1s linear infinite;

									@keyframes spin {
										0% { transform: rotate(0deg); }
										100% { transform: rotate(360deg); }
									}
								`}
							/>
							<span
								className={css`
									font-size: 18px;
									font-weight: 600;
									color: #09090b;
									background: linear-gradient(45deg, #8b5cf6, #06b6d4);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
									background-clip: text;
								`}
							>
								{__('AI is creating your form...', 'quillforms')}
							</span>
						</div>

						<div
							className={css`
								font-size: 14px;
								color: #6b7280;
								font-weight: 400;
								line-height: 1.5;
							`}
						>
							{__('Connecting to AI service and generating your perfect form structure.', 'quillforms')}
						</div>

						<div
							className={css`
								background: rgba(139, 92, 246, 0.1);
								border: 1px solid rgba(139, 92, 246, 0.2);
								border-radius: 8px;
								padding: 12px 16px;
								font-size: 13px;
								color: #5b21b6;
								max-width: 400px;
							`}
						>
							💡 {__('Tip: The AI analyzes your description to create the most appropriate form fields and structure.', 'quillforms')}
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			className={css`
				width: 100%;
				padding: 0 2rem;
			`}
		>
			<div
				className={css`
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					gap: 2rem;
					margin: 3rem auto;
					max-width: 60rem;
				`}
			>
				{/* Header */}
				<div
					className={css`
						display: flex;
						flex-direction: column;
						align-items: center;
						gap: 1rem;
						text-align: center;
					`}
				>
					<div
						className={css`
							font-size: 32px;
							font-weight: 600;
							gap: 12px;
						`}
					>
						<span
							className={css`
								background: linear-gradient(45deg, #8b5cf6, #06b6d4);
								-webkit-background-clip: text;
								-webkit-text-fill-color: transparent;
								background-clip: text;
								font-weight: 700;
							`}
						>
							{__('Describe Your Perfect Form', 'quillforms')}
						</span>
						<StarIcon />
					</div>
					<p
						className={css`
							font-size: 16px;
							color: #6b7280;
							max-width: 500px;
							line-height: 1.6;
						`}
					>
						{__('Tell our AI what kind of form you need, and it will create it instantly!', 'quillforms')}
					</p>
				</div>

				{/* Error message */}
				{error && (
					<div
						className={css`
							width: 100%;
							max-width: 500px;
							padding: 16px 20px;
							background: #fef2f2;
							border: 1px solid #fecaca;
							border-radius: 12px;
							color: #dc2626;
							font-weight: 500;
							text-align: center;
							display: flex;
							align-items: center;
							gap: 8px;
						`}
					>
						<span>⚠️</span>
						<span>{error}</span>
						<button
							onClick={() => setError('')}
							className={css`
								margin-left: auto;
								background: none;
								border: none;
								color: #dc2626;
								cursor: pointer;
								font-size: 18px;
								padding: 0;
								width: 20px;
								height: 20px;
								display: flex;
								align-items: center;
								justify-content: center;
							`}
						>
							×
						</button>
					</div>
				)}

				{/* Form Fields */}
				<div
					className={css`
						width: 100%;
						max-width: 600px;
						display: flex;
						flex-direction: column;
						gap: 1.5rem;
					`}
				>
					{/* Main Description Field */}
					<div
						className={css`
							display: flex;
							flex-direction: column;
							gap: 0.5rem;
						`}
					>
						<label
							className={css`
								font-size: 16px;
								font-weight: 600;
								color: #09090b;
								display: flex;
								align-items: center;
								gap: 8px;
							`}
							htmlFor="form-description"
						>
							🎯 {__('What kind of form do you want to create?', 'quillforms')}
						</label>
						<textarea
							className={css`
								width: 100%;
								min-height: 120px;
								padding: 16px 20px;
								border: 2px solid #e3e3e3;
								border-radius: 12px;
								font-size: 16px;
								font-family: inherit;
								resize: vertical;
								transition: all 0.2s ease;

								&:focus {
									outline: none;
									border-color: #8b5cf6;
									box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
								}

								&::placeholder {
									color: #9ca3af;
									font-style: italic;
								}
							`}
							name="form-description"
							placeholder={__(
								'Example: "Create a job application form with personal details, work experience, education background, and file upload for resume"',
								'quillforms'
							)}
							ref={descriptionRef}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
						<div
							className={css`
								display: flex;
								justify-content: space-between;
								align-items: center;
							`}
						>
							<p
								className={css`
									font-size: 14px;
									color: #6b7280;
									margin: 0;
								`}
							>
								{__('Be specific about the fields and features you need!', 'quillforms')}
							</p>
							<span
								className={css`
									font-size: 12px;
									color: ${description.length >= 5 ? '#059669' : '#9ca3af'};
									font-weight: 500;
								`}
							>
								{description.length >= 5 ? '✓ Ready' : `${Math.max(0, 5 - description.length)} more chars`}
							</span>
						</div>
					</div>

					{/* Optional Fields Grid */}
					<div
						className={css`
							display: grid;
							grid-template-columns: 1fr 1fr;
							gap: 1.5rem;

							@media (max-width: 768px) {
								grid-template-columns: 1fr;
							}
						`}
					>
						{/* Form Type */}
						<div
							className={css`
								display: flex;
								flex-direction: column;
								gap: 0.5rem;
							`}
						>
							<label
								className={css`
									font-size: 14px;
									font-weight: 600;
									color: #374151;
									display: flex;
									align-items: center;
									gap: 6px;
								`}
								htmlFor="form-type"
							>
								📋 {__('Form Type', 'quillforms')}
								<span className={css`color: #9ca3af; font-weight: 400; font-size: 12px;`}>
									({__('optional', 'quillforms')})
								</span>
							</label>
							<select
								className={css`
									width: 100%;
									padding: 12px 16px;
									border: 1.5px solid #e3e3e3;
									border-radius: 8px;
									font-size: 14px;
									background: white;
									cursor: pointer;
									transition: border-color 0.2s ease;

									&:focus {
										outline: none;
										border-color: #8b5cf6;
									}
								`}
								name="form-type"
								value={formType}
								onChange={(e) => setFormType(e.target.value)}
							>
								<option value="">{__('Choose a type...', 'quillforms')}</option>
								<option value="contact">{__('Contact Form', 'quillforms')}</option>
								<option value="survey">{__('Survey', 'quillforms')}</option>
								<option value="registration">{__('Registration', 'quillforms')}</option>
								<option value="application">{__('Application', 'quillforms')}</option>
								<option value="feedback">{__('Feedback', 'quillforms')}</option>
								<option value="booking">{__('Booking', 'quillforms')}</option>
								<option value="quiz">{__('Quiz', 'quillforms')}</option>
								<option value="order">{__('Order Form', 'quillforms')}</option>
							</select>
						</div>

						{/* Industry */}
						<div
							className={css`
								display: flex;
								flex-direction: column;
								gap: 0.5rem;
							`}
						>
							<label
								className={css`
									font-size: 14px;
									font-weight: 600;
									color: #374151;
									display: flex;
									align-items: center;
									gap: 6px;
								`}
								htmlFor="industry"
							>
								🏢 {__('Industry', 'quillforms')}
								<span className={css`color: #9ca3af; font-weight: 400; font-size: 12px;`}>
									({__('optional', 'quillforms')})
								</span>
							</label>
							<select
								className={css`
									width: 100%;
									padding: 12px 16px;
									border: 1.5px solid #e3e3e3;
									border-radius: 8px;
									font-size: 14px;
									background: white;
									cursor: pointer;
									transition: border-color 0.2s ease;

									&:focus {
										outline: none;
										border-color: #8b5cf6;
									}
								`}
								name="industry"
								value={industry}
								onChange={(e) => setIndustry(e.target.value)}
							>
								<option value="">{__('Select industry...', 'quillforms')}</option>
								<option value="healthcare">{__('Healthcare', 'quillforms')}</option>
								<option value="education">{__('Education', 'quillforms')}</option>
								<option value="real-estate">{__('Real Estate', 'quillforms')}</option>
								<option value="technology">{__('Technology', 'quillforms')}</option>
								<option value="finance">{__('Finance', 'quillforms')}</option>
								<option value="retail">{__('Retail', 'quillforms')}</option>
								<option value="hospitality">{__('Hospitality', 'quillforms')}</option>
								<option value="non-profit">{__('Non-Profit', 'quillforms')}</option>
								<option value="government">{__('Government', 'quillforms')}</option>
								<option value="other">{__('Other', 'quillforms')}</option>
							</select>
						</div>
					</div>

					{/* Complexity Selector */}
					<div
						className={css`
							display: flex;
							flex-direction: column;
							gap: 0.75rem;
						`}
					>
						<label
							className={css`
								font-size: 14px;
								font-weight: 600;
								color: #374151;
								display: flex;
								align-items: center;
								gap: 6px;
							`}
						>
							⚡ {__('Complexity Level', 'quillforms')}
						</label>
						<div
							className={css`
								display: grid;
								grid-template-columns: repeat(3, 1fr);
								gap: 12px;
							`}
						>
							{[
								{ value: 'Simple', emoji: '🌟', desc: __('3-5 basic questions', 'quillforms') },
								{ value: 'Medium', emoji: '🚀', desc: __('5-8 varied questions', 'quillforms') },
								{ value: 'Complex', emoji: '🎯', desc: __('8+ advanced features', 'quillforms') }
							].map((option) => (
								<button
									key={option.value}
									type="button"
									className={css`
										padding: 16px 12px;
										border: 2px solid ${complexity === option.value ? '#8b5cf6' : '#e3e3e3'};
										border-radius: 8px;
										background: ${complexity === option.value ? 'rgba(139, 92, 246, 0.05)' : 'white'};
										cursor: pointer;
										transition: all 0.2s ease;
										text-align: center;

										&:hover {
											border-color: #8b5cf6;
											background: rgba(139, 92, 246, 0.05);
										}
									`}
									onClick={() => setComplexity(option.value)}
								>
									<div className={css`font-size: 20px; margin-bottom: 4px;`}>
										{option.emoji}
									</div>
									<div className={css`
										font-size: 14px;
										font-weight: 600;
										color: ${complexity === option.value ? '#8b5cf6' : '#374151'};
										margin-bottom: 2px;
									`}>
										{option.value}
									</div>
									<div className={css`
										font-size: 11px;
										color: #6b7280;
										line-height: 1.3;
									`}>
										{option.desc}
									</div>
								</button>
							))}
						</div>
					</div>



					{/* Ready indicator */}
					{description.length >= 5 && (
						<div
							className={css`
								text-align: center;
								padding: 20px;
								background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%);
								border-radius: 12px;
								border: 1px solid rgba(139, 92, 246, 0.1);
							`}
						>
							<p
								className={css`
									margin: 0 0 12px 0;
									font-size: 14px;
									color: #5b21b6;
									font-weight: 500;
								`}
							>
								🎉 {__('Perfect! Your form will be generated securely through WordPress!', 'quillforms')}
							</p>
							<p
								className={css`
									margin: 0;
									font-size: 12px;
									color: #6b7280;
								`}
							>
								{__('Click "Generate Form ✨" below to create your form', 'quillforms')}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default GenerateAiForm;