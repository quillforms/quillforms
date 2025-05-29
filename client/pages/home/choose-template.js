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

	// Update parent component's next button state
	useEffect(() => {
		if (chosenTemplate) {
			setCanProceed(true);
			setNextButtonText(__('Use Selected Template', 'quillforms'));
			setNextButtonAction(() => () => setShowTemplateModal(true));
		} else {
			setCanProceed(false);
			setNextButtonText(__('Use Selected Template', 'quillforms'));
			setNextButtonAction(null);
		}
	}, [chosenTemplate, setCanProceed, setNextButtonText, setNextButtonAction]);

	const handleUseTemplate = async () => {
		if (!chosenTemplate) return;

		let $requiredAddons = [];

		if (size(formTemplates[chosenTemplate]?.required_addons) > 0) {
			map(formTemplates[chosenTemplate]?.required_addons, (addon) => {
				if (
					!StoreAddons[addon]?.is_installed ||
					!StoreAddons[addon]?.is_active
				) {
					$requiredAddons.push(addon);
				}
			});
		}

		if (size($requiredAddons) > 0) {
			setRequiredAddons($requiredAddons);
			setShowTemplateModal(false);
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

				{/* Categories Section */}
				<div
					className={css`
						margin: 20px 0 30px 0;
						padding: 0 20px;
					`}
				>
					<div
						className={css`
							display: flex;
							gap: 8px;
							overflow-x: auto;
							padding: 8px 0;
							scrollbar-width: none;
							-ms-overflow-style: none;

							&::-webkit-scrollbar {
								display: none;
							}

							@media (max-width: 768px) {
								gap: 6px;
							}
						`}
					>
						{categories.map((category) => {
							const isSelected = selectedCategory === category;
							return (
								<button
									key={category}
									className={css`
										background: ${isSelected
											? '#5C22CA33'
											: '#5C22CA05'};
										color: ${isSelected
											? '#5C22CA'
											: '#404040'};
										border: ${isSelected
											? 'none'
											: '1px solid #C8C8C8B2'};
										border-radius: 20px;
										padding: 8px 16px;
										font-size: 14px;
										font-weight: 600;
										cursor: pointer;
										white-space: nowrap;
										transition: all 0.2s ease;
										flex-shrink: 0;

										&:hover {
											transform: translateY(-1px);
										}

										&:active {
											transform: translateY(0);
										}

										@media (max-width: 768px) {
											padding: 6px 12px;
											font-size: 13px;
										}
									`}
									onClick={() => {
										setSelectedCategory(category);
										// Reset selected template when changing category
										setChosenTemplate(null);
									}}
								>
									{category}
								</button>
							);
						})}
					</div>
				</div>

				{/* Templates Grid */}
				<div
					className={css`
						display: grid;
						grid-template-columns: repeat(3, 1fr);
						gap: 20px;
						padding: 20px;
						margin-bottom: 5rem;

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

									&:hover {
										border-color: ${isSelected
											? '#5c22ca'
											: 'none'};
										transform: translateY(-2px);
										box-shadow: 0 4px 12px
											rgba(0, 0, 0, 0.1);
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
								<div>
									<h3
										className={css`
											margin: 0;
											font-size: 18px;
											font-weight: 600;
											color: #000000cc;
											display: flex;
											align-items: center;
											gap: 8px;
											padding-bottom: 20px;
											padding-left: 20px;
										`}
									>
										{template.title}
										{size(
											formTemplates[templateName]
												?.required_addons
										) > 0 &&
											license?.status !== 'valid' && (
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
										A free template designed to be used to
										collect new information. A comprehensive
										solution for capturing essential contact
										details and registration data
										efficiently.
									</p>

									{/* Use Template Button */}
									<Button
										isPrimary
										className={css`
											width: 100%;
											height: 45px !important;
											background: #5c22ca !important;
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

											&:hover {
												background: #5856eb !important;
											}

											&:disabled {
												opacity: 0.7 !important;
											}
										`}
										onClick={handleUseTemplate}
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
										) : (
											<>
												Use This Template
												<CopyIcon />
											</>
										)}
									</Button>
								</div>

								{/* Categories Section */}
								<div
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
								</div>
							</div>
						</div>

						{/* Right Panel - Template Details */}
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
										You'll be able to change that old with
										your business, your website, and your
										customer's expectations with your
										business.
									</p>

									<p
										className={css`
											font-size: 16px;
											font-weight: 500;
											color: #4c4c4c;
											line-height: 1.5;
											margin: 0 0 16px 0;
										`}
									>
										Transform this template by modifying
										forms to related opportunities,
										modifying questions, and adding your
										brand to make it more personalized for
										your customers.
									</p>

									<p
										className={css`
											font-size: 16px;
											font-weight: 500;
											color: #4c4c4c;
											line-height: 1.5;
											margin: 0;
										`}
									>
										With use of adaptive forms for this
										template, you can collect responsive
										information and online information. You
										process information and customer builds
										on your business.
									</p>
								</div>

								{/* Details Section */}
								<div
									className={css`
										padding: 24px 32px;
										width: 33.333%;
										flex: 1;
									`}
								>
									<h3
										className={css`
											font-size: 20px;
											font-weight: 600;
											color: #1a1a1a;
											margin: 0 0 16px 0;
										`}
									>
										Details
									</h3>

									<span
										className={css`
											font-size: 16px;
											color: #4c4c4c;
											font-weight: 500;
										`}
									>
										1,047,369 Clone
									</span>
								</div>
							</div>

							{/* Related Templates Section */}
							<div
								className={css`
									padding: 40px 32px 32px 0px;
								`}
							>
								<div
									className={css`
										display: flex;
										align-items: center;
										justify-content: space-between;
										margin-bottom: 24px;
									`}
								>
									<h3
										className={css`
											font-size: 20px;
											font-weight: 600;
											margin: 0;
										`}
									>
										Related templates
									</h3>
									<div
										className={css`
											display: flex;
											gap: 8px;
										`}
									>
										<button
											className={css`
												width: 32px;
												height: 32px;
												border: 1px solid #5c22ca;
												border-radius: 24px;
												background: white;
												display: flex;
												align-items: center;
												justify-content: center;
												cursor: pointer;
												transition: all 0.2s ease;

												&:hover {
													background: #f2ebff;
												}

												&:disabled {
													opacity: 0.5;
													cursor: not-allowed;
												}

												svg {
													stroke: #5c22ca;
												}
											`}
											onClick={() => {
												const container =
													document.querySelector(
														'[data-slider-container]'
													);
												if (container) {
													container.scrollBy({
														left: -332, // Card width (300px) + gap (16px) + padding (16px)
														behavior: 'smooth',
													});
												}
											}}
										>
											<Icon icon="arrow-left-alt2" />
										</button>
										<button
											className={css`
												width: 32px;
												height: 32px;
												border: 1px solid #5c22ca;
												border-radius: 24px;
												background: white;
												display: flex;
												align-items: center;
												justify-content: center;
												cursor: pointer;
												transition: all 0.2s ease;

												&:hover {
													background: #f2ebff;
												}

												&:disabled {
													opacity: 0.5;
													cursor: not-allowed;
												}

												svg {
													stroke: #5c22ca;
												}
											`}
											onClick={() => {
												const container =
													document.querySelector(
														'[data-slider-container]'
													);
												if (container) {
													container.scrollBy({
														left: 332, // Card width (300px) + gap (16px) + padding (16px)
														behavior: 'smooth',
													});
												}
											}}
										>
											<Icon icon="arrow-right-alt2" />
										</button>
									</div>
								</div>

								<div
									data-slider-container
									className={css`
										display: flex;
										gap: 16px;
										overflow-x: auto;
										padding-bottom: 16px;
										scrollbar-width: none;
										-ms-overflow-style: none;
										scroll-snap-type: x mandatory;
										scroll-behavior: smooth;
										width: 100%; /* Remove fixed width */

										&::-webkit-scrollbar {
											display: none;
										}
									`}
								>
									{/* Template Cards */}
									{Object.keys(formTemplates)
										.filter(
											(templateName) =>
												templateName !== chosenTemplate
										)
										.slice(0, 6) // Show more templates for better scrolling
										.map((templateName) => {
											const template =
												formTemplates[templateName];
											return (
												<div
													key={templateName}
													className={css`
														flex: 0 0 300px;
														border: 2px solid
															#0000000d;
														border-radius: 10px;
														cursor: pointer;
														transition: all 0.2s
															ease;
														background: white;
														overflow: hidden;
														scroll-snap-align: start;

														&:hover {
															border-color: #5c22ca;
															box-shadow: 0 4px
																12px
																rgba(
																	0,
																	0,
																	0,
																	0.1
																);
														}
													`}
													onClick={() => {
														setChosenTemplate(
															templateName
														);
														setShowTemplateModal(
															false
														);
														setTimeout(
															() =>
																setShowTemplateModal(
																	true
																),
															100
														);
													}}
												>
													<div
														className={css`
															width: 100%;
															height: 160px;
															border-top-left-radius: 10px;
															border-top-right-radius: 10px;
															overflow: hidden;
															padding: 10px;
															background: #f2ebff;

															img {
																width: 100%;
																height: 100%;
																object-fit: cover;
																border-radius: 10px;
															}
														`}
													>
														<img
															src={
																template.screenshot
															}
															alt={template.title}
														/>
													</div>
													<div>
														<h3
															className={css`
																margin: 0;
																font-size: 16px;
																font-weight: 600;
																color: #000000cc;
																display: flex;
																align-items: center;
																gap: 8px;
																padding: 16px;
															`}
														>
															{template.title}
															{size(
																template?.required_addons
															) > 0 &&
																license?.status !==
																	'valid' && (
																	<span
																		style={{
																			borderRadius:
																				'62px',
																			background:
																				'#5C22CA33',
																			color: '#5C22CA',
																			fontSize:
																				'12px',
																			fontWeight:
																				'600',
																			padding:
																				'2px 8px',
																		}}
																	>
																		Pro
																	</span>
																)}
														</h3>
													</div>
												</div>
											);
										})}
								</div>
							</div>
						</div>
					</div>
				</Modal>
			)}

			{/* Required Addons Modal */}
			{size(requiredAddons) > 0 && (
				<Modal
					className={classnames(css`
						border: none !important;
						border-radius: 9px;
					`)}
					onRequestClose={() => {
						setRequiredAddons([]);
					}}
					title={__('Required Addons', 'quillforms')}
				>
					<div>
						<p>
							{__(
								'This template requires the following addons to be installed and activated:',
								'quillforms'
							)}
						</p>
						<ul>
							{map(requiredAddons, (addon) => {
								return (
									<li
										className={css`
											display: flex;
											justify-content: space-between;
											align-items: center;
											padding: 10px;
											border: 1px solid rgb(227, 227, 227);
											border-radius: 4px;
											margin-bottom: 10px;
										`}
									>
										<span>{StoreAddons[addon]?.name}</span>
										<Button
											isPrimary
											isButton
											className={css`
												padding: 0 !important;
												background-color: #1e87f0;

												a {
													text-decoration: none;
													color: #fff;
													padding: 2px 8px;
													background-color: #1e87f0;
												}
											`}
										>
											<NavLink
												to={`/admin.php?page=quillforms&path=addons`}
											>
												Install
											</NavLink>
										</Button>
									</li>
								);
							})}
						</ul>
					</div>
				</Modal>
			)}
		</>
	);
};

export default ChooseTemplate;
