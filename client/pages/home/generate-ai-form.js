/**
 * QuillForms Dependencies.
 */
import { Button, TextControl } from '@quillforms/admin-components';
import { getHistory, getNewPath } from '@quillforms/navigation';

/**
 * WordPress Dependencies
 */
import { useEffect, useRef, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { Oval as Loader } from 'react-loader-spinner';
import { css } from 'emotion';
import AiIcon from './ai-icon';
import StarIcon from './stars-icon';
import LoadingIcon from './loading-icon';

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

	const descriptionRef = useRef(null);

	useEffect(() => {
		if (descriptionRef && descriptionRef.current) {
			descriptionRef.current.focus();
		}
	}, []);

	// Update parent component's next button state when required fields change
	useEffect(() => {
		const canProceed = description.trim().length > 0;
		setCanProceed(canProceed);
		setNextButtonText(__('Generate Form', 'quillforms'));

		// Set the action for the next button
		setNextButtonAction(() => generateAiForm);
	}, [description, setCanProceed, setNextButtonText, setNextButtonAction]);

	const generateAiForm = async () => {
		setIsLoading(true);
		setShowLoader(true);

		try {
			console.log('generated');
			// Simulate API call - replace with actual API call
			await new Promise((resolve) => setTimeout(resolve, 3000));
		} catch (error) {
			console.error('Error generating AI form:', error);
		} finally {
			setIsLoading(false);
			setShowLoader(false);
		}
	};

	// Render the loader overlay when generating (keeps modal structure)
	if (showLoader) {
		return (
			<div
				className={css`
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background: linear-gradient(
						135deg,
						#f8fafc 0%,
						#e2e8f0 100%
					);
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					z-index: 999999;
				`}
			>
				{/* Loader overlay */}
				<div
					className={css`
						position: absolute;
						top: -2rem;
						left: 0;
						right: 0;
						bottom: -2rem;
						background: linear-gradient(
							135deg,
							#f8fafc 0%,
							#e2e8f0 100%
						);
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						z-index: 1000;
						border-radius: 12px;
					`}
				>
					{/* Animated background shapes */}
					<div
						className={css`
							position: absolute;
							width: 100%;
							height: 100%;
							overflow: hidden;
							opacity: 0.05;
						`}
					>
						{/* Floating shapes */}
						{[...Array(6)].map((_, i) => (
							<div
								key={i}
								className={css`
									position: absolute;
									background: #5c22ca;
									border-radius: 50%;
									animation: float 6s ease-in-out infinite;
									animation-delay: ${i * 0.5}s;

									${i === 0 &&
									`
										width: 60px;
										height: 60px;
										top: 10%;
										left: 10%;
									`}
									${i === 1 &&
									`
										width: 80px;
										height: 80px;
										top: 20%;
										right: 15%;
									`}
									${i === 2 &&
									`
										width: 40px;
										height: 40px;
										bottom: 30%;
										left: 20%;
									`}
									${i === 3 &&
									`
										width: 100px;
										height: 100px;
										bottom: 20%;
										right: 10%;
									`}
									${i === 4 &&
									`
										width: 50px;
										height: 50px;
										top: 50%;
										left: 5%;
									`}
									${i === 5 &&
									`
										width: 70px;
										height: 70px;
										top: 60%;
										right: 5%;
									`}

									@keyframes float {
										0%,
										100% {
											transform: translateY(0px)
												rotate(0deg);
										}
										50% {
											transform: translateY(-20px)
												rotate(180deg);
										}
									}
								`}
							/>
						))}
					</div>

					{/* Main content */}
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
						{/* Form preview mockup */}
						<LoadingIcon />

						{/* Loading spinner */}
						<div
							className={css`
								display: flex;
								align-items: center;
								gap: 1rem;
							`}
						>
							<div
								className={css`
									width: 20px;
									height: 20px;
									border: 2px solid #e3e3e3;
									border-top: 2px solid #5c22ca;
									border-radius: 50%;
									animation: spin 1s linear infinite;

									@keyframes spin {
										0% {
											transform: rotate(0deg);
										}
										100% {
											transform: rotate(360deg);
										}
									}
								`}
							/>
							<span
								className={css`
									font-size: 18px;
									font-weight: 500;
									color: #09090b;
								`}
							>
								{__('Generating input fields...', 'quillforms')}
							</span>
						</div>

						{/* Status text */}
						<div
							className={css`
								font-size: 14px;
								color: #6b7280;
								font-weight: 400;
							`}
						>
							{__('Please wait...', 'quillforms')}
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
						`}
					>
						<span
							className={css`
								background: linear-gradient(
									45deg,
									#8b5cf6,
									#06b6d4
								);
								-webkit-background-clip: text;
								-webkit-text-fill-color: transparent;
								background-clip: text;
								font-weight: 700;
							`}
						>
							{__('Generate Form With AI', 'quillforms')}
						</span>
						<StarIcon />
					</div>
				</div>

				{/* Form Fields */}
				<div
					className={css`
						width: 100%;
						display: flex;
						flex-direction: column;
						gap: 1.5rem;
					`}
				>
					{/* Description Field */}
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
							`}
							htmlFor="form-description"
						>
							{__(
								'Describe the form you want to create',
								'quillforms'
							)}
						</label>
						<textarea
							className={css`
								width: 100%;
								min-height: 120px;
								padding: 12px 16px;
								border: 1.5px solid #e3e3e3;
								border-radius: 12px;
								font-size: 16px;
								font-family: inherit;
								resize: vertical;
								transition: border-color 0.2s ease;

								&:focus {
									outline: none;
									border-color: #5c22ca;
								}

								&::placeholder {
									color: #9ca3af;
								}
							`}
							name="form-description"
							placeholder={__(
								'E.g., create a job application form with personal details, education, work experience, and Skills sections',
								'quillforms'
							)}
							ref={descriptionRef}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
						<p
							className={css`
								font-size: 14px;
								color: #9197a4;
								margin: 0;
							`}
						>
							{__(
								'You can edit and customize the result later.',
								'quillforms'
							)}
						</p>
					</div>

					{/* Form Type and Industry Row */}
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
									font-size: 16px;
									font-weight: 600;
									color: #09090b;
								`}
								htmlFor="form-type"
							>
								{__('Form Type', 'quillforms')}
								<span
									className={css`
										color: #9197a4;
										font-weight: 400;
										font-size: 14px;
										margin-left: 10px;
									`}
								>
									({__('Optional', 'quillforms')})
								</span>
							</label>
							<select
								className={css`
									width: 100%;
									padding: 12px 16px;
									max-width: 100% !important;
									height: 48px !important;
									border: 1.5px solid #e3e3e3 !important ;
									border-radius: 10px !important;
									font-size: 16px;
									background: white;
									cursor: pointer;
									transition: border-color 0.2s ease;

									&:focus {
										outline: none;
										border-color: #5c22ca;
									}
								`}
								name="form-type"
								value={formType}
								onChange={(e) => setFormType(e.target.value)}
							>
								<option value="">
									{__(
										'e.g., Contact, survey, registration',
										'quillforms'
									)}
								</option>
								<option value="contact">
									{__('Contact Form', 'quillforms')}
								</option>
								<option value="survey">
									{__('Survey', 'quillforms')}
								</option>
								<option value="registration">
									{__('Registration', 'quillforms')}
								</option>
								<option value="application">
									{__('Application', 'quillforms')}
								</option>
								<option value="feedback">
									{__('Feedback', 'quillforms')}
								</option>
								<option value="booking">
									{__('Booking', 'quillforms')}
								</option>
								<option value="quiz">
									{__('Quiz', 'quillforms')}
								</option>
								<option value="order">
									{__('Order Form', 'quillforms')}
								</option>
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
									font-size: 16px;
									font-weight: 600;
									color: #09090b;
								`}
								htmlFor="industry"
							>
								{__('Industry', 'quillforms')}
								<span
									className={css`
										color: #9197a4;
										font-weight: 400;
										font-size: 14px;
										margin-left: 10px;
									`}
								>
									({__('Optional', 'quillforms')})
								</span>
							</label>
							<select
								className={css`
									width: 100%;
									padding: 12px 16px;
									max-width: 100% !important;
									height: 48px !important;
									border: 1.5px solid #e3e3e3 !important ;
									border-radius: 10px !important;
									font-size: 16px;
									background: white;
									cursor: pointer;
									transition: border-color 0.2s ease;

									&:focus {
										outline: none;
										border-color: #5c22ca;
									}
								`}
								name="industry"
								value={industry}
								onChange={(e) => setIndustry(e.target.value)}
							>
								<option value="">
									{__(
										'E.g., healthcare, education, real estate',
										'quillforms'
									)}
								</option>
								<option value="healthcare">
									{__('Healthcare', 'quillforms')}
								</option>
								<option value="education">
									{__('Education', 'quillforms')}
								</option>
								<option value="real-estate">
									{__('Real Estate', 'quillforms')}
								</option>
								<option value="technology">
									{__('Technology', 'quillforms')}
								</option>
								<option value="finance">
									{__('Finance', 'quillforms')}
								</option>
								<option value="retail">
									{__('Retail', 'quillforms')}
								</option>
								<option value="hospitality">
									{__('Hospitality', 'quillforms')}
								</option>
								<option value="non-profit">
									{__('Non-Profit', 'quillforms')}
								</option>
								<option value="government">
									{__('Government', 'quillforms')}
								</option>
								<option value="other">
									{__('Other', 'quillforms')}
								</option>
							</select>
						</div>
					</div>

					{/* Complexity */}
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
							`}
							htmlFor="complexity"
						>
							{__('Complexity', 'quillforms')}
						</label>
						<select
							className={css`
								width: 100%;
								padding: 12px 16px;
								max-width: 100% !important;
								height: 48px !important;
								border: 1.5px solid #e3e3e3 !important ;
								border-radius: 10px !important;
								font-size: 16px;
								background: white;
								cursor: pointer;
								transition: border-color 0.2s ease;

								&:focus {
									outline: none;
									border-color: #5c22ca;
								}
							`}
							name="complexity"
							value={complexity}
							onChange={(e) => setComplexity(e.target.value)}
						>
							<option value="Simple">
								{__('Simple', 'quillforms')}
							</option>
							<option value="Medium">
								{__('Medium', 'quillforms')}
							</option>
							<option value="Complex">
								{__('Complex', 'quillforms')}
							</option>
						</select>
					</div>

					{/* Additional Instructions */}
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
							`}
							htmlFor="additional-instructions"
						>
							{__('Additional instructions', 'quillforms')}
							<span
								className={css`
									color: #9197a4;
									font-weight: 400;
									font-size: 14px;
									margin-left: 10px;
								`}
							>
								({__('Optional', 'quillforms')})
							</span>
						</label>
						<textarea
							className={css`
								width: 100%;
								min-height: 80px;
								padding: 12px 16px;
								border: 1.5px solid #e3e3e3;
								border-radius: 12px;
								font-size: 16px;
								font-family: inherit;
								resize: vertical;
								transition: border-color 0.2s ease;

								&:focus {
									outline: none;
									border-color: #5c22ca;
								}

								&::placeholder {
									color: #9ca3af;
								}
							`}
							name="additional-instructions"
							placeholder={__(
								'Any specific requirements or details',
								'quillforms'
							)}
							value={additionalInstructions}
							onChange={(e) =>
								setAdditionalInstructions(e.target.value)
							}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GenerateAiForm;
