/**
 * WordPress Dependencies.
 */
import { Modal } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies.
 */
import { css } from 'emotion';
import classnames from 'classnames';
import AddFormTitle from './add-form-title';
import { Icon } from '@wordpress/components';
import TemplateIcon from './template-icon';
import ChooseTemplate from './choose-template';
import GenerateAiForm from './generate-ai-form';
import { Logo } from '@quillforms/admin-components';
import CardBackground from './card-background';
import AiIcon from './ai-icon';
import ArrowLeftIcon from './arrow-left-icon';
import ArrowRightIcon from './arrow-right-icon';
import CopyIcon from './copy-icon';
import MagicPenIcon from './magic-pen-icon';

const AddFormModal = ({ closeModal }) => {
	const [formTitleScreen, setFormTitleScreen] = useState(false);
	const [formTemplateScreen, setFormTemplateScreen] = useState(false);
	const [formAiScreen, setFormAiScreen] = useState(false);
	const [selectedCard, setSelectedCard] = useState(null);
	const [currentStep, setCurrentStep] = useState(1);

	// States for child component actions
	const [canProceed, setCanProceed] = useState(false);
	const [nextButtonText, setNextButtonText] = useState('Next');
	const [nextButtonAction, setNextButtonAction] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	// Calculate progress percentage
	const getProgressPercentage = () => {
		let progress = 10;

		// Step 1: Card selection (0-50%)
		if (selectedCard) {
			progress = 40;
		}

		// Step 2: Next page navigation (50-100%)
		if (formTitleScreen || formTemplateScreen || formAiScreen) {
			progress = 75;
		}

		return progress;
	};

	const handleCardClick = (cardType) => {
		setSelectedCard(cardType);
	};

	const handleNextClick = () => {
		if (isOnCardSelectionScreen) {
			// Original card selection logic
			if (selectedCard) {
				switch (selectedCard) {
					case 'scratch':
						setFormTitleScreen(true);
						break;
					case 'template':
						setFormTemplateScreen(true);
						break;
					case 'ai':
						setFormAiScreen(true);
						break;
				}
				setCurrentStep(2);
			}
		} else {
			// Execute the action from child component
			if (nextButtonAction) {
				nextButtonAction();
			}
		}
	};

	const handleBackClick = () => {
		if (formTitleScreen || formTemplateScreen || formAiScreen) {
			// Go back to card selection
			setFormTitleScreen(false);
			setFormTemplateScreen(false);
			setFormAiScreen(false);
			setCurrentStep(1);
			// Reset child component states
			setCanProceed(false);
			setNextButtonText('Next');
			setNextButtonAction(null);
			setIsLoading(false);
		} else {
			// Close modal or go to previous step
			closeModal();
		}
	};

	const isOnCardSelectionScreen =
		!formTitleScreen && !formTemplateScreen && !formAiScreen;

	// Determine if Next button should be shown and enabled
	const isNextButtonDisabled = isOnCardSelectionScreen
		? !selectedCard
		: !canProceed || isLoading;

	// Determine which icon to show based on the button text
	// Determine which icon to show based on the selected creation method
	const getNextButtonIcon = () => {
		if (isLoading) {
			return (
				<div
					style={{
						width: '16px',
						height: '16px',
						border: '2px solid rgba(255,255,255,0.3)',
						borderTop: '2px solid white',
						borderRadius: '50%',
						animation: 'spin 1s linear infinite',
					}}
				></div>
			);
		}

		if (formTitleScreen || formTemplateScreen) {
			// Icon for blank form creation
			return <CopyIcon />;
		} else if (formAiScreen) {
			// Icon for AI generation
			return <MagicPenIcon />;
		}

		// Default icon (shouldn't normally be reached)
		return <ArrowRightIcon />;
	};

	return (
		<Modal
			className={classnames(
				'quillforms-home__add-form-modal',
				css`
					width: 100% !important;
					height: 100% !important;
					max-height: 100%;
					max-width: 100%;
					margin-right: 0;
					margin-left: 0;
					margin-top: 0;
					margin-bottom: 0;
					border-radius: 0;

					.components-modal__content {
						display: flex;
						flex-direction: column;
						justify-content: flex-start;
						padding: 20px 0 0;
						margin-top: 60px;
						background: white;
						height: 100%;
						&:before {
							display: none;
						}
						.components-modal__header {
							margin: 0 0 20px;
							border-bottom: 1px solid #e3e3e3;
							padding: 13px 32px 8px;
							.components-modal__header-heading {
								font-size: 1rem;
								font-family: 'Roboto', sans-serif;
								font-weight: 700;
								font-size: 28px;
								width: 59%;
							}

							div {
								justify-content: space-between;
							}
						}
						> div:last-child {
							width: 100%;
							flex: 1;
							display: flex;
							flex-direction: column;

							h2 {
								font-size: 20px;
							}
							input {
								width: 100%;
								padding: 10px;
								background: transparent;
								border: 1.5px solid #e3e3e3 !important;
								font-size: 16px !important;
							}
						}
					}

					/* Card Selection Styles */
					.create-form-cards {
						display: flex;
						gap: 20px;
						justify-content: center;
						flex-wrap: wrap;
					}

					.create-from-scratch-card:hover,
					.choose-template-card:hover,
					.create-ai-form:hover {
						transform: translateY(-2px);
						box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
					}

					.create-from-scratch-card.selected,
					.choose-template-card.selected,
					.create-ai-form.selected {
						transform: scale(1.02);
						border: 1.8px solid #5c22ca;
					}

					/* Footer Styles */
					.modal-footer {
						background: white;
						margin-bottom: 7rem;
						padding-bottom: 1rem;
						border-bottom: 1px solid #e3e3e3;
						display: flex;
						flex-direction: column;
						gap: 15px;
					}

					/* Progress Bar Styles */
					.progress-tracker {
						width: 100%;
						height: 10px;
						background-color: #e8e8e8;
						overflow: hidden;
					}

					.progress-fill {
						height: 100%;
						background: #c3a6f9;
						transition: width 0.5s ease-in-out;
					}

					/* Button Styles */
					.footer-buttons {
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 0px 16rem;
					}

					.footer-button {
						display: flex;
						align-items: center;
						justify-content: center;
						padding: 12px 32px;
						font-size: 16px;
						font-weight: 500;
						border-radius: 24px;
						cursor: pointer;
						transition: all 0.2s ease;
						border: none;
						min-width: 100px;
					}

					.back-button {
						background: white;
						color: #5c22ca;
						border: 1px solid #5c22ca;
						display: flex;
						gap: 10px;
						align-items: center;
					}

					.next-button {
						background: #5c22ca;
						color: white;
						display: flex;
						gap: 10px;
						align-items: center;
					}

					.next-button:disabled {
						opacity: 30%;
						cursor: not-allowed;
					}

					.next-button.loading {
						cursor: wait;
					}

					.quillforms-home__add-form-modal-footer button {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 49%;
						padding: 20px 10px;
						font-size: 18px;
					}
				`
			)}
			title={
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '10px',
					}}
				>
					<Logo />
					<div>{__('Create New Form', 'quillforms')}</div>
				</div>
			}
			onRequestClose={closeModal}
			shouldCloseOnClickOutside={false}
		>
			<div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
				{formTitleScreen ? (
					<AddFormTitle
						closeModal={closeModal}
						setCanProceed={setCanProceed}
						setNextButtonText={setNextButtonText}
						setNextButtonAction={setNextButtonAction}
						setIsLoading={setIsLoading}
					/>
				) : (
					<>
						{formTemplateScreen ? (
							<ChooseTemplate
								setCanProceed={setCanProceed}
								setNextButtonText={setNextButtonText}
								setNextButtonAction={setNextButtonAction}
								setIsLoading={setIsLoading}
							/>
						) : formAiScreen ? (
							<GenerateAiForm
								closeModal={closeModal}
								setCanProceed={setCanProceed}
								setNextButtonText={setNextButtonText}
								setNextButtonAction={setNextButtonAction}
								setIsLoading={setIsLoading}
							/>
						) : (
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
									gap: '30px',
									marginTop: '10rem',
									marginBottom: '10rem',
									padding: '0 20px',
									flex: 1,
								}}
							>
								<div
									style={{
										fontSize: '32px',
										fontWeight: '600',
										color: '#09090B',
										textAlign: 'center',
									}}
								>
									{__(
										'Choose how you`d like to build your Form',
										'quillforms'
									)}
								</div>

								<div className="create-form-cards">
									<div
										className={`create-from-scratch-card ${selectedCard === 'scratch' ? 'selected' : ''}`}
										onClick={() =>
											handleCardClick('scratch')
										}
									>
										<div>
											<div>
												<CardBackground />
											</div>
											<span>
												{__('Blank Page', 'quillforms')}
											</span>
										</div>
										<span
											style={{
												paddingTop: '20px',
												paddingBottom: '20px',
											}}
										>
											{__(
												'Start from scratch',
												'quillforms'
											)}
										</span>
									</div>

									<div
										className={`choose-template-card ${selectedCard === 'template' ? 'selected' : ''}`}
										onClick={() =>
											handleCardClick('template')
										}
									>
										<div>
											<div>
												<CardBackground />
											</div>
											<div className="template-icon">
												<TemplateIcon />
											</div>
										</div>
										<span
											style={{
												paddingTop: '20px',
												paddingBottom: '20px',
											}}
										>
											{__(
												'Choose A Pre-built Template',
												'quillforms'
											)}
										</span>
									</div>

									<div
										className={`create-ai-form ${selectedCard === 'ai' ? 'selected' : ''}`}
										onClick={() => handleCardClick('ai')}
									>
										<div>
											<div>
												<CardBackground />
											</div>
											<div className="ai-icon">
												<AiIcon />
											</div>
										</div>
										<span
											style={{
												paddingTop: '20px',
												paddingBottom: '20px',
												display: 'flex',
												gap: '10px',
												alignItems: 'center',
											}}
										>
											{__(
												'Generate With AI',
												'quillforms'
											)}
											<span
												style={{
													borderRadius: '62px',
													background: '#5C22CA33',
													color: '#5C22CA',
													fontSize: '14px',
													fontWeight: '600',
													padding: '2px 12px',
												}}
											>
												{__('Beta', 'quillforms')}
											</span>
										</span>
									</div>
								</div>
							</div>
						)}
					</>
				)}
			</div>

			{/* Footer with Progress Bar and Buttons */}
			<div className="modal-footer">
				{/* Progress Tracker Bar */}
				<div className="progress-tracker">
					<div
						className="progress-fill"
						style={{ width: `${getProgressPercentage()}%` }}
					></div>
				</div>

				{/* Navigation Buttons */}
				<div className="footer-buttons">
					<button
						className="footer-button back-button"
						onClick={handleBackClick}
					>
						<ArrowLeftIcon /> {__('Back', 'quillforms')}
					</button>

					<button
						className={`footer-button next-button ${isLoading ? 'loading' : ''}`}
						onClick={handleNextClick}
						disabled={isNextButtonDisabled}
					>
						{nextButtonText} {getNextButtonIcon()}
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default AddFormModal;
