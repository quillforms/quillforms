/**
 * WordPress Dependencies.
 */
import { Modal } from '@wordpress/components';
import { useState, useRef } from '@wordpress/element';
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

// Missing ScratchIcon component - needs to be imported or defined
const ScratchIcon = () => (
	<div style={{ width: '24px', height: '24px', background: '#ccc' }}></div>
);

// Screen types enumeration
const SCREENS = {
	CARD_SELECTION: 'card_selection',
	FORM_TITLE: 'form_title',
	TEMPLATE: 'template',
	AI_FORM: 'ai_form'
};

const CARD_TYPES = {
	SCRATCH: 'scratch',
	TEMPLATE: 'template',
	AI: 'ai'
};

const AddFormModal = ({ closeModal }) => {
	// Consolidated navigation state
	const [currentScreen, setCurrentScreen] = useState(SCREENS.CARD_SELECTION);
	const [selectedCard, setSelectedCard] = useState(null);

	// Consolidated child component state
	const [childState, setChildState] = useState({
		canProceed: false,
		nextButtonText: 'Next',
		nextButtonAction: null,
		isLoading: false
	});

	// Use a ref to store the latest action function
	const nextButtonActionRef = useRef(null);

	// Helper function to update child state
	const updateChildState = (updates) => {
		setChildState(prev => ({ ...prev, ...updates }));
	};

	// Calculate progress percentage
	const getProgressPercentage = () => {
		if (currentScreen === SCREENS.CARD_SELECTION) {
			return selectedCard ? 40 : 10;
		}
		return 75; // Any secondary screen
	};

	const handleCardClick = (cardType) => {
		setSelectedCard(cardType);
	};

	const handleNextClick = async () => {

		if (currentScreen === SCREENS.CARD_SELECTION) {
			// Navigate to appropriate screen based on selected card
			const screenMap = {
				[CARD_TYPES.SCRATCH]: SCREENS.FORM_TITLE,
				[CARD_TYPES.TEMPLATE]: SCREENS.TEMPLATE,
				[CARD_TYPES.AI]: SCREENS.AI_FORM
			};
			setCurrentScreen(screenMap[selectedCard]);
		} else {
			// Execute the action from child component

			// Try the ref first, then fallback to state
			const actionToExecute = nextButtonActionRef.current || childState.nextButtonAction;

			if (actionToExecute && typeof actionToExecute === 'function') {
				console.log('✅ Found valid function, executing...');
				try {
					await actionToExecute();
				} catch (error) {
					console.error('❌ Error executing action:', error);
				}
			} else {
				console.error('❌ nextButtonAction is not a function:', {
					refValue: nextButtonActionRef.current,
					stateValue: childState.nextButtonAction,
					refType: typeof nextButtonActionRef.current,
					stateType: typeof childState.nextButtonAction
				});
			}
		}
	};

	const handleBackClick = () => {
		if (currentScreen !== SCREENS.CARD_SELECTION) {
			// Go back to card selection
			setCurrentScreen(SCREENS.CARD_SELECTION);
			setSelectedCard(null);
			// Reset child component state
			setChildState({
				canProceed: false,
				nextButtonText: 'Next',
				nextButtonAction: null,
				isLoading: false
			});
			// Reset action ref
			nextButtonActionRef.current = null;
		} else {
			// Close modal
			closeModal();
		}
	};

	// Determine if Next button should be shown and enabled
	const isNextButtonDisabled = currentScreen === SCREENS.CARD_SELECTION
		? !selectedCard
		: !childState.canProceed || childState.isLoading;

	// Determine which icon to show based on the screen and button text
	const getNextButtonIcon = () => {
		if (childState.isLoading) {
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

		const iconMap = {
			[SCREENS.FORM_TITLE]: <CopyIcon />,
			[SCREENS.TEMPLATE]: <CopyIcon />,
			[SCREENS.AI_FORM]: <MagicPenIcon />
		};

		return iconMap[currentScreen] || <ArrowRightIcon />;
	};

	// Render the main content based on current screen
	const renderMainContent = () => {
		const commonChildProps = {
			closeModal,
			setCanProceed: (value) => updateChildState({ canProceed: value }),
			setNextButtonText: (value) => updateChildState({ nextButtonText: value }),
			setNextButtonAction: (value) => {
				console.log('🔄 Setting next button action:', typeof value);
				updateChildState({ nextButtonAction: value });
				// Store in ref for reliable access
				nextButtonActionRef.current = value;
			},
			setIsLoading: (value) => updateChildState({ isLoading: value })
		};

		switch (currentScreen) {
			case SCREENS.FORM_TITLE:
				return <AddFormTitle {...commonChildProps} />;

			case SCREENS.TEMPLATE:
				return <ChooseTemplate {...commonChildProps} />;

			case SCREENS.AI_FORM:
				return <GenerateAiForm {...commonChildProps} />;

			default: // SCREENS.CARD_SELECTION
				return (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							gap: '30px',
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
							{__('Choose how you\'d like to build your Form', 'quillforms')}
						</div>

						<div className="create-form-cards">
							{[
								{
									key: CARD_TYPES.SCRATCH,
									className: 'create-from-scratch-card',
									icon: <ScratchIcon />,
									iconClassName: 'scratch-icon',
									text: __('Start from scratch', 'quillforms')
								},
								{
									key: CARD_TYPES.TEMPLATE,
									className: 'choose-template-card',
									icon: <TemplateIcon />,
									iconClassName: 'template-icon',
									text: __('Choose A Pre-built Template', 'quillforms')
								},
								{
									key: CARD_TYPES.AI,
									className: 'create-ai-form',
									icon: <AiIcon />,
									iconClassName: 'ai-icon',
									text: __('Generate With AI', 'quillforms'),
									badge: __('Beta', 'quillforms')
								}
							].map(({ key, className, icon, iconClassName, text, badge }) => (
								<div
									key={key}
									className={`${className} ${selectedCard === key ? 'selected' : ''}`}
									onClick={() => handleCardClick(key)}
								>
									<div>
										<div>
											<CardBackground />
										</div>
										<div className={iconClassName}>
											{icon}
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
										{text}
										{badge && (
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
												{badge}
											</span>
										)}
									</span>
								</div>
							))}
						</div>
					</div>
				);
		}
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

					@keyframes spin {
						0% { transform: rotate(0deg); }
						100% { transform: rotate(360deg); }
					}

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
						margin-bottom: 100px;
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
						position: fixed;
						bottom: 0;
						width: 100%;
						background: white;
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
				{renderMainContent()}
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
						className={`footer-button next-button ${childState.isLoading ? 'loading' : ''}`}
						onClick={handleNextClick}
						disabled={isNextButtonDisabled}
					>
						{childState.nextButtonText} {getNextButtonIcon()}
					</button>
				</div>
			</div>

		</Modal>
	);
};

export default AddFormModal;