import ConfigAPI from '@quillforms/config';
import { useState, useEffect } from '@wordpress/element';
import { Icon, Modal } from '@wordpress/components';
import {
	Button,
	ProLabel,
	__experimentalFeatureAvailability,
} from '@quillforms/admin-components';
import { getHistory, getNewPath, NavLink } from '@quillforms/navigation';
import apiFetch from '@wordpress/api-fetch';
import { map, size } from 'lodash';
import { css } from 'emotion';
import classnames from 'classnames';
import { __ } from '@wordpress/i18n';
import CopyIcon from './copy-icon';

const ChooseTemplate = ({
	setCanProceed,
	setNextButtonText,
	setNextButtonAction,
	setIsLoading,
	closeModal,
}) => {
	const formTemplates = ConfigAPI.getFormTemplates();
	const [chosenTemplate, setChosenTemplate] = useState(null);
	const [showTemplateModal, setShowTemplateModal] = useState(false);
	const [templateLoading, setTemplateLoading] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState('All Templates');
	const license = ConfigAPI.getLicense();
	const [displayProModal, setDisplayProModal] = useState(false);
	const [requiredAddons, setRequiredAddons] = useState([]);
	const StoreAddons = ConfigAPI.getStoreAddons();

	// Categories data - you can modify this based on your actual categories
	const categories = [
		'All Templates',
		'Applications',
		'Appointment',
		'Checklist',
		'Business',
		'HR',
		'Financial Services',
		'Health Care',
		'Feedback',
		'Job App',
	];

	// Filter templates based on selected category
	const getFilteredTemplates = () => {
		if (selectedCategory === 'All Templates') {
			return formTemplates;
		}
		// Add your filtering logic here based on template categories
		// For now, returning all templates - you'll need to add category property to your templates
		return formTemplates;
	};

	const filteredTemplates = getFilteredTemplates();

	// Check if template has missing required addons
	const getTemplateMissingAddons = (templateName) => {
		const missingAddons = [];
		if (size(formTemplates[templateName]?.required_addons) > 0) {
			map(formTemplates[templateName]?.required_addons, (addon) => {
				if (
					!StoreAddons[addon]?.is_installed ||
					!StoreAddons[addon]?.is_active
				) {
					missingAddons.push(addon);
				}
			});
		}
		return missingAddons;
	};

	// Check if template can be used (no missing addons)
	const canUseTemplate = (templateName) => {
		const missingAddons = getTemplateMissingAddons(templateName);
		return missingAddons.length === 0;
	};

	const handleUseTemplate = async () => {
		console.log('handleUseTemplate called with template:', chosenTemplate);
		if (!chosenTemplate) return;

		const missingAddons = getTemplateMissingAddons(chosenTemplate);

		if (missingAddons.length > 0) {
			// Redirect directly to addons page instead of showing modal
			const history = getHistory();
			history.push(getNewPath({}, 'addons'));
			setShowTemplateModal(false);
			closeModal();
			return;
		}

		setTemplateLoading(true);
		setIsLoading(true);

		try {
			let data = {};
			data['title'] = formTemplates[chosenTemplate].title;
			data['status'] = 'publish';
			data['blocks'] = formTemplates[chosenTemplate].data.blocks;

			if (formTemplates[chosenTemplate].data.settings) {
				data = {
					...data,
					settings: formTemplates[chosenTemplate].data.settings,
				};
			}
			if (formTemplates[chosenTemplate].data.payments) {
				data = {
					...data,
					payments: formTemplates[chosenTemplate].data.payments,
				};
			}
			if (formTemplates[chosenTemplate].data.logic) {
				data = {
					...data,
					logic: formTemplates[chosenTemplate].data.logic,
				};
			}
			if (formTemplates[chosenTemplate].data.quiz) {
				data = {
					...data,
					quiz: formTemplates[chosenTemplate].data.quiz,
				};
			}
			if (formTemplates[chosenTemplate].data.products) {
				data = {
					...data,
					products: formTemplates[chosenTemplate].data.products,
				};
			}

			const res = await apiFetch({
				path: '/wp/v2/quill_forms',
				method: 'POST',
				data,
			});

			const { id } = res;
			getHistory().push(getNewPath({}, `/forms/${id}/builder`));
		} catch (error) {
			console.error('Error creating form from template:', error);
			setTemplateLoading(false);
			setIsLoading(false);
		}
	};

	// Update parent component's next button state
	useEffect(() => {
		if (chosenTemplate) {
			// Always enable the button and allow viewing any template
			setCanProceed(true);
			setNextButtonText(__('View Selected Template', 'quillforms'));

			// Always show the template modal when button is clicked
			setNextButtonAction(() => {
				setShowTemplateModal(true);
			});
		} else {
			setCanProceed(false);
			setNextButtonText(__('View Selected Template', 'quillforms'));
			setNextButtonAction(null);
		}
	}, [chosenTemplate]);

	return (
		<>
			<div className="choose-template">
				<div className="choose-template__header">
					<h2>{__('Choose A Template', 'quillforms')}</h2>
					<p>
						{__(
							'Start with a template to save time and be more productive.',
							'quillforms'
						)}
					</p>
				</div>

				{/* Templates Grid */}
				<div
					className={css`
						display: grid;
						grid-template-columns: repeat(3, 1fr);
						gap: 20px;
						padding: 20px;
						margin-bottom: 10rem;

						@media (max-width: 1024px) {
							grid-template-columns: repeat(2, 1fr);
						}

						@media (max-width: 640px) {
							grid-template-columns: 1fr;
						}
					`}
				>
					{Object.keys(filteredTemplates).map((templateName) => {
						const template = filteredTemplates[templateName];
						const isSelected = chosenTemplate === templateName;
						const missingAddons = getTemplateMissingAddons(templateName);
						const hasRequiredAddons = size(template?.required_addons) > 0;

						return (
							<div
								key={templateName}
								className={css`
									border: 2px solid
										${isSelected ? '#5c22ca' : '#0000000D'};
									border-radius: 10px;
									cursor: pointer;
									transition: all 0.2s ease;
									background: white;
									margin-bottom: 1rem;
									position: relative;

									&:hover {
										border-color: ${isSelected ? '#5c22ca' : '#5c22ca'};
										transform: translateY(-2px);
										box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
									}

									${isSelected &&
									`
                                        box-shadow: 0 4px 20px rgba(92, 34, 202, 0.15);
                                        transform: translateY(-2px);
                                    `}
								`}
								onClick={() => {
									setChosenTemplate(templateName);
								}}
							>
								{/* Pro Badge for templates requiring addons */}
								{hasRequiredAddons && (
									<div
										className={css`
											position: absolute;
											top: 10px;
											right: 10px;
											background: #5c22ca;
											color: white;
											padding: 4px 8px;
											border-radius: 12px;
											font-size: 12px;
											font-weight: 600;
											z-index: 2;
											display: flex;
											align-items: center;
											gap: 4px;
										`}
									>
										<Icon icon="admin-plugins" size={12} />
										{__('Pro Features', 'quillforms')}
									</div>
								)}

								<div
									className={css`
										width: 100%;
										height: 200px;
										border-top-left-radius: 10px;
										border-top-right-radius: 10px;
										overflow: hidden;
										padding: 10px;
										margin-bottom: 20px;
										background: #f2ebff;
										position: relative;

										img {
											width: 100%;
											height: 100%;
											object-fit: cover;
											border-radius: 10px;
										}
									`}
								>
									<img
										src={template.screenshot}
										alt={template.name}
									/>
								</div>

								<div className={css`padding: 0 20px 20px 20px;`}>
									<h3
										className={css`
											margin: 0 0 12px 0;
											font-size: 18px;
											font-weight: 600;
											color: #000000cc;
											display: flex;
											align-items: center;
											gap: 8px;
										`}
									>
										{template.title}
										{hasRequiredAddons && license?.status !== 'valid' && (
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
												Pro
											</span>
										)}
									</h3>

									{/* Simple addon count indicator */}
									{hasRequiredAddons && (
										<div
											className={css`
												margin-top: 8px;
												font-size: 12px;
												color: #666;
												display: flex;
												align-items: center;
												gap: 4px;
											`}
										>
											<Icon icon="admin-plugins" size={12} />
											{template.required_addons.length === 1
												? __('Requires 1 addon', 'quillforms')
												: __(`Requires ${template.required_addons.length} addons`, 'quillforms')
											}
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Template Preview Modal */}
			{showTemplateModal && chosenTemplate && (
				<Modal
					style={{
						width: '75rem',
						overflow: 'auto',
						marginTop: '56px',
						marginBottom: '20px',
					}}
					className={css`
						.components-modal__content {
							display: flex;
							flex-direction: column;
							height: 100%;
							margin-top: 0 !important;
							padding: 0 2rem 2rem 2rem !important;
							background: #ffffff;
						}

						.components-modal__header {
							display: none !important;
						}
					`}
					onRequestClose={() => setShowTemplateModal(false)}
					shouldCloseOnClickOutside={true}
				>
					<div
						className={css`
							display: flex;
							flex-direction: column;
							width: 100%;
							height: 100%;
						`}
					>
						{/* Close Button */}
						<div
							className={css`
								display: flex;
								justify-content: flex-end;
								padding: 16px;
								position: relative;
								z-index: 10;
							`}
						>
							<button
								className={css`
									width: 32px;
									height: 32px;
									border: none;
									background: white;
									border-radius: 4px;
									cursor: pointer;
									display: flex;
									align-items: center;
									justify-content: center;

									&:hover {
										background: #f8f9fa;
									}

									svg {
										width: 16px;
										height: 16px;
										color: #666;
									}
								`}
								onClick={() => setShowTemplateModal(false)}
							>
								<Icon icon="no-alt" />
							</button>
						</div>

						<div
							className={css`
								display: flex;
								gap: 2rem;
								align-items: flex-start;
								width: 100%;
							`}
						>
							{/* Form Preview Container */}
							<div
								className={css`
									display: flex;
									align-items: center;
									justify-content: center;
									padding: 40px 40px 0px 40px;
									background: #5c22ca1a;
									height: 30rem;
									width: 66.666%;
								`}
							>
								<div
									className={css`
										width: 100%;
										height: 100%;
										background: white;
										border-top-left-radius: 8px;
										border-top-right-radius: 8px;
										overflow: hidden;

										iframe {
											width: 100%;
											height: 100%;
											border: none;
										}
									`}
								>
									<iframe
										title={
											formTemplates[chosenTemplate].title
										}
										src={formTemplates[chosenTemplate].link}
										loading="lazy"
									/>
								</div>
							</div>

							{/* Right Panel - Template Details */}
							<div
								className={css`
									width: 33.333%;
									background: white;
									display: flex;
									flex-direction: column;
								`}
							>
								{/* Header Section */}
								<div>
									<h1
										className={css`
											font-size: 32px;
											font-weight: 600;
											margin: 0 0 8px 0;
											line-height: 1.3;
										`}
									>
										{formTemplates[chosenTemplate].title}
									</h1>

									<p
										className={css`
											font-size: 16px;
											color: #4c4c4c;
											font-weight: 600;
											margin: 0 0 20px 0;
											line-height: 1.4;
										`}
									>
										{formTemplates[chosenTemplate]?.short_description}
									</p>

									{/* Required Addons Section in Modal */}
									{size(formTemplates[chosenTemplate]?.required_addons) > 0 && (
										<div
											className={css`
												margin-bottom: 20px;
												padding: 16px;
												background: #f8f9fa;
												border-radius: 12px;
												border: 1px solid #e9ecef;
											`}
										>
											<h4
												className={css`
													font-size: 16px;
													font-weight: 600;
													color: #333;
													margin: 0 0 12px 0;
													display: flex;
													align-items: center;
													gap: 8px;
												`}
											>
												<Icon icon="admin-plugins" size={16} />
												{__('Required Addons', 'quillforms')}
											</h4>

											<div
												className={css`
													display: flex;
													flex-direction: column;
													gap: 8px;
												`}
											>
												{formTemplates[chosenTemplate].required_addons.map((addon) => {
													const isInstalled = StoreAddons[addon]?.is_installed && StoreAddons[addon]?.is_active;
													return (
														<div
															key={addon}
															className={css`
																display: flex;
																align-items: center;
																justify-content: space-between;
																padding: 8px 12px;
																background: ${isInstalled ? '#e8f5e8' : '#ffebee'};
																border: 1px solid ${isInstalled ? '#c8e6c9' : '#ffcdd2'};
																border-radius: 8px;
																transition: all 0.2s ease;
															`}
														>
															<div
																className={css`
																	display: flex;
																	align-items: center;
																	gap: 8px;
																`}
															>
																<Icon
																	icon={isInstalled ? 'yes-alt' : 'dismiss'}
																	size={16}
																	className={css`
																		color: ${isInstalled ? '#2e7d32' : '#c62828'};
																	`}
																/>
																<span
																	className={css`
																		font-size: 14px;
																		font-weight: 500;
																		color: ${isInstalled ? '#2e7d32' : '#c62828'};
																	`}
																>
																	{StoreAddons[addon]?.name || addon}
																</span>
															</div>

															<span
																className={css`
																	font-size: 12px;
																	font-weight: 600;
																	padding: 2px 8px;
																	border-radius: 12px;
																	background: ${isInstalled ? '#2e7d32' : '#c62828'};
																	color: white;
																`}
															>
																{isInstalled ? __('Installed', 'quillforms') : __('Missing', 'quillforms')}
															</span>
														</div>
													);
												})}
											</div>

											{getTemplateMissingAddons(chosenTemplate).length > 0 && (
												<div
													className={css`
														margin-top: 12px;
														padding: 12px;
														background: #fff3e0;
														border: 1px solid #ffb74d;
														border-radius: 8px;
														display: flex;
														align-items: center;
														gap: 8px;
													`}
												>
													<Icon icon="warning" size={16} style={{ color: '#f57c00' }} />
													<span
														className={css`
															font-size: 13px;
															color: #e65100;
															font-weight: 500;
														`}
													>
														{getTemplateMissingAddons(chosenTemplate).length === 1
															? __('Please install the missing addon to use this template.', 'quillforms')
															: __('Please install the missing addons to use this template.', 'quillforms')
														}
													</span>
												</div>
											)}
										</div>
									)}

									{/* Use Template Button */}
									<Button
										isPrimary
										className={css`
											width: 100%;
											height: 45px !important;
											background: ${getTemplateMissingAddons(chosenTemplate).length > 0
												? '#9e9e9e !important'
												: '#5c22ca !important'};
											border: none !important;
											color: white !important;
											padding-top: 12px !important;
											padding-bottom: 12px !important;
											font-weight: 500 !important;
											border-radius: 24px !important;
											font-size: 14px !important;
											display: flex !important;
											align-items: center !important;
											justify-content: center !important;
											gap: 8px !important;
											cursor: pointer !important;

											&:hover {
												background: ${getTemplateMissingAddons(chosenTemplate).length > 0
												? '#757575 !important'
												: '#5856eb !important'};
											}

											&:disabled {
												opacity: 0.7 !important;
											}
										`}
										onClick={() => {
											if (getTemplateMissingAddons(chosenTemplate).length > 0) {
												// Redirect directly to addons page
												const history = getHistory();
												history.push(getNewPath({}, 'addons'));
												// Close all modals
												setShowTemplateModal(false);
												closeModal();
											} else {
												handleUseTemplate();
											}
										}}
										disabled={templateLoading}
									>
										{templateLoading ? (
											<>
												<div
													className={css`
														width: 16px;
														height: 16px;
														border: 2px solid
															rgba(
																255,
																255,
																255,
																0.3
															);
														border-top: 2px solid
															white;
														border-radius: 50%;
														animation: spin 1s
															linear infinite;

														@keyframes spin {
															0% {
																transform: rotate(
																	0deg
																);
															}
															100% {
																transform: rotate(
																	360deg
																);
															}
														}
													`}
												/>
												Creating...
											</>
										) : getTemplateMissingAddons(chosenTemplate).length > 0 ? (
											<>
												<Icon icon="admin-plugins" />
												{__('Install Required Addons', 'quillforms')}
											</>
										) : (
											<>
												Use This Template
												<CopyIcon />
											</>
										)}
									</Button>
								</div>

								{/* Categories Section */}
								{/* <div
									className={css`
										padding-top: 2rem;
									`}
								>
									<h3
										className={css`
											font-size: 18px;
											font-weight: 600;
											color: #1a1a1a;
											margin: 0 0 16px 0;
										`}
									>
										Categories
									</h3>

									<div
										className={css`
											display: flex;
											flex-wrap: wrap;
											gap: 8px;
										`}
									>
										{[
											'Application',
											'Appointment',
											'Feedback',
											'Business',
											'Financial Services',
											'Health Care',
											'Checklist',
										].map((category) => (
											<span
												key={category}
												className={css`
													background: #5c22ca05;
													color: #404040;
													font-size: 14px;
													font-weight: 600;
													padding: 8px 16px;
													border: 1px solid #c8c8c8b2;
													border-radius: 16px;
													white-space: nowrap;
												`}
											>
												{category}
											</span>
										))}
									</div>
								</div> */}
							</div>
						</div>

						{/* Additional template details section */}
						<div
							className={css`
								background: white;
								display: flex;
								flex-direction: column;
								padding-top: 3rem;

								@media (max-width: 1024px) {
									width: 350px;
								}
							`}
						>
							<div
								className={css`
									background: white;
									display: flex;
									align-items: flex-start;
								`}
							>
								{/* About Section */}
								<div
									className={css`
										padding: 24px 32px 0px 0;
										width: 69%;
									`}
								>
									<h3
										className={css`
											font-size: 20px;
											font-weight: 600;
											margin: 0 0 20px 0;
										`}
									>
										About this template
									</h3>

									<p
										className={css`
											font-size: 16px;
											font-weight: 500;
											color: #4c4c4c;
											line-height: 1.5;
											margin: 0 0 16px 0;
										`}
									>
										{formTemplates[chosenTemplate]?.long_description}
									</p>
								</div>
							</div>
						</div>
					</div>
				</Modal>
			)}
		</>
	);
};

export default ChooseTemplate;