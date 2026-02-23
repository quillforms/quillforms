/**
 * QuillForms Dependencies.
 */
import ConfigApi from '@quillforms/config';
import {
	Button,
	__experimentalAddonFeatureAvailability,
} from '@quillforms/admin-components';
import { setForceReload, NavLink } from '@quillforms/navigation';

/**
 * WordPress Dependencies
 */
import { useState, useEffect, useRef } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { isEqual } from 'lodash';
import classNames from 'classnames';
/**
 * Internal Dependencies
 */
import './style.scss';
import CustomTabs from '../../components/custom-tabs';
import CustomSearch from '../../components/custom-search';
import CustomButton from '../../components/custom-button';
import CustomModal from '../../components/custom-modal';
import lockImage from '../../../assets/images/lock.png';
import noAddonImage from '../../../assets/images/no-addon.png';

// Category definitions for the addons filter tabs (shape compatible with CustomTabs)
const ADDON_CATEGORIES = [
	{ name: 'all', title: __('All', 'quillforms') },
	{
		name: 'data_export',
		title: __('Data Management & Export', 'quillforms'),
	},
	{
		name: 'analytics',
		title: __('Analytics & Tracking', 'quillforms'),
	},
	{
		name: 'email_marketing',
		title: __('Email Marketing', 'quillforms'),
	},
	{
		name: 'crm',
		title: __('CRM Integrations', 'quillforms'),
	},
	{
		name: 'automation',
		title: __('Productivity & Automation Tools', 'quillforms'),
	},
	{
		name: 'communication',
		title: __('Communication & Support', 'quillforms'),
	},
];

// Map addon names to categories (fallbacks to "other" if not listed)
const ADDON_CATEGORY_BY_NAME = {
	// Data Management & Export
	'PDF Entries Export': 'data_export',
	'Google Sheets': 'data_export',
	'Airtable': 'data_export',

	// Analytics & Tracking
	'Google Tag Manager': 'analytics',
	'Google Analytics': 'analytics',
	'Facebook Pixel': 'analytics',

	// Email Marketing
	'MailChimp': 'email_marketing',
	'AWeber': 'email_marketing',
	'ActiveCampaign': 'email_marketing',

	// CRM / Communication & Support / Automation will use additional names as needed
};

const getAddonCategory = (data) => {
	if (!data || !data.name) return 'other';
	return ADDON_CATEGORY_BY_NAME[data.name] || 'other';
};

const Addons = () => {
	const [addons, setAddons] = useState(ConfigApi.getStoreAddons());
	const [apiAction, setApiAction] = useState(null);
	const [proModalAddon, setProModalAddon] = useState(null);
	const [highlightedAddon, setHighlightedAddon] = useState(null);
	const [activeCategory, setActiveCategory] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');

	// Create refs for each addon element
	const addonRefs = useRef({});

	const { createErrorNotice, createSuccessNotice } = useDispatch(
		'core/notices'
	);

	useEffect(() => {
		if (!isEqual(addons, ConfigApi.getStoreAddons())) {
			ConfigApi.setStoreAddons(addons);
		}
	}, [addons]);

	useEffect(() => {
		// Get the integration parameter from URL
		const urlParams = new URLSearchParams(window.location.search);
		const integration = urlParams.get('integration');
		if (integration) {
			setHighlightedAddon(integration);

			// Wait for the component to render before scrolling
			setTimeout(() => {
				if (addonRefs.current[integration]) {
					addonRefs.current[integration].scrollIntoView({
						behavior: 'smooth',
						block: 'center',
					});
				}
			}, 300);
		}
	}, []);

	const api = (action, addon) => {
		// prevent doing 2 actions at the same time.
		if (apiAction) return;
		setApiAction({ action, addon });

		const data = new FormData();
		data.append('action', `quillforms_addon_${action}`);
		data.append('_nonce', window['qfAdmin'].site_store_nonce);
		data.append('addon', addon);

		fetch(`${window['qfAdmin'].adminUrl}admin-ajax.php`, {
			method: 'POST',
			credentials: 'same-origin',
			body: data,
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.success) {
					createSuccessNotice(__('✅ ', 'quillforms') + res.data, {
						type: 'snackbar',
						isDismissible: true,
					});
					switch (action) {
						case 'activate':
							setAddons((addons) => {
								return {
									...addons,
									[addon]: {
										...addons[addon],
										is_active: true,
									},
								};
							});
							// allow the new addons to register their scripts.
							setForceReload(true);
							break;
						case 'install':
							setAddons((addons) => {
								return {
									...addons,
									[addon]: {
										...addons[addon],
										is_installed: true,
									},
								};
							});
							break;
					}
				} else {
					createErrorNotice(`⛔ ${res.data ?? 'Error'}`, {
						type: 'snackbar',
						isDismissible: true,
					});
				}
			})
			.catch((err) => {
				createErrorNotice(`⛔ ${err ?? 'Error'}`, {
					type: 'snackbar',
					isDismissible: true,
				});
			})
			.finally(() => {
				setApiAction(null);
			});
	};

	const isDoingApiAction = (action, addon) => {
		return (
			apiAction &&
			apiAction.action === action &&
			apiAction.addon === addon
		);
	};

	return (
		<div className="quillforms-addons-page">
			<h1 className="quillforms-addons-page__heading">{__('Addons', 'quillforms')}</h1>

			<div className="quillforms-addons-page__body">
				<CustomTabs
					className="quillforms-addons-page__tabs"
					tabs={ADDON_CATEGORIES}
					onSelect={setActiveCategory}
					initialTabName={activeCategory}
				>
					{() => (
						< div className=" bg-[#F7F8FA] border border-border-color rounded-[20px] py-6 px-5 min-h-[calc(100vh-200px)]">
							<div className="quillforms-addons-page__filters">
								<div className="quillforms-addons-page__search">
									<CustomSearch
										value={searchTerm}
										onChange={setSearchTerm}
										placeholder={__(
											'Search for an integration',
											'quillforms'
										)}
									/>
								</div>
							</div>

							<div className="quillforms-addons-page__body-addons">
								{(() => {
									const filteredAddons = Object.entries(addons).filter(([_, data]) => {
										// Category filter
										if (activeCategory !== 'all') {
											const cat =
												getAddonCategory(data);
											if (cat !== activeCategory)
												return false;
										}

										// Search filter
										if (!searchTerm) return true;
										const term =
											searchTerm.toLowerCase();
										return (
											(data.name || '')
												.toLowerCase()
												.includes(term) ||
											(data.description || '')
												.toLowerCase()
												.includes(term)
										);
									});

									if (filteredAddons.length === 0) {
										return (
											<div className="quillforms-addons-page__empty-state">
												<img
													src={noAddonImage}
													alt="No addons"
													className="block mx-auto "
												/>
												<h3 className="text-center mt-6 text-2xl font-bold text-[#334155]">
													{__('Your addons list is still empty', 'quillforms')}
												</h3>
												<p className="text-center mt-3 text-lg font-medium leading-7 text-[#777]">
													{__('Your dashboard has no active addons. Connect tools to streamline communication, tracking, and automation.', 'quillforms')}
												</p>
											</div>
										);
									}

									return filteredAddons.map(([addon, data]) => {
										const isHighlighted =
											highlightedAddon === addon;
										return (
											<div
												key={addon}
												ref={(el) =>
												(addonRefs.current[addon] =
													el)
												}
												className={classNames(
													'quillforms-addons-page_addon',
													{
														'quillforms-addons-page_addon--highlighted':
															isHighlighted,
													}
												)}
											>
												<div className="quillforms-addons-page_addon__header">
													<div>
														<div
															className={classNames(
																'quillforms-addons-page_addon-icon'
															)}
														>
															<img
																src={
																	data.assets
																		.icon
																}
															/>
														</div>
														<div className="quillforms-addons-page_addon__title">
															{data.name}
														</div>
													</div>
													<div className="quillforms-addons-page__body-addon-footer">
														{!data.is_installed ? (
															<CustomButton
																variant="outlineSecondary"
																className='!py-2 !px-3 !rounded-[8px]'
																text={
																	isDoingApiAction(
																		'install',
																		addon
																	)
																		? __(
																			'Installing...',
																			'quillforms'
																		)
																		: __(
																			'Install',
																			'quillforms'
																		)
																}
																onClick={() => {
																	if (
																		ConfigApi.isPlanAccessible(
																			data.plan
																		)
																	) {
																		api(
																			'install',
																			addon
																		);
																	} else {
																		setProModalAddon(
																			addon
																		);
																	}
																}}
																disabled={
																	apiAction !==
																	null
																}
															/>
														) : !data.is_active ? (
															<CustomButton
																variant="outlineSecondary"
																text={
																	isDoingApiAction(
																		'activate',
																		addon
																	)
																		? __(
																			'Activating...',
																			'quillforms'
																		)
																		: __(
																			'Activate',
																			'quillforms'
																		)
																}
																onClick={() =>
																	api(
																		'activate',
																		addon
																	)
																}
																disabled={
																	apiAction !==
																	null
																}
															/>
														) : (
															<span className="quillforms-addons-active">
																{__(
																	'Active',
																	'quillforms'
																)}
															</span>
														)}
													</div>
												</div>

												<div className="quillforms-addons-page__body-addon">
													<p>
														{
															data.description
														}
													</p>

												</div>
											</div>
										);
									});
								})()}
							</div>
						</div>
					)}
				</CustomTabs>
			</div>
			<CustomModal
				isOpen={!!proModalAddon}
				onClose={() => setProModalAddon(null)}
				noPadding={true}
				title={proModalAddon ? addons[proModalAddon].name + __(' is a pro addon', 'quillforms') : ''}
				centerTitle={true}
			>
				{proModalAddon && (() => {
					const addon = addons[proModalAddon];
					const featurePlanLabel = ConfigApi.getPlans()[addon.plan]?.label || 'Basic';
					const isWPEnv = ConfigApi.isWPEnv();

					return (
						<__experimentalAddonFeatureAvailability
							featureName={addon.name + __(' addon', 'quillforms')}
							addonSlug={proModalAddon}
							showLockIcon={true}
							customIcon={
								<img
									src={lockImage}
									alt="Lock icon"
									style={{ display: 'block', margin: '0 auto' }}
								/>
							}
							customDescription={
								<p style={{ fontSize: '15px', color: '#334155', margin: '0 0 20px 0' }}>
									{__("We're sorry, ", 'quillforms')}
									{addon.name}
									{__(' is not available on your plan. Please upgrade to the ', 'quillforms')}
									{featurePlanLabel}
									{__(' plan to unlock all of ', 'quillforms')}
									{featurePlanLabel}
									{__(' features.', 'quillforms')}
								</p>
							}
							customButton={
								isWPEnv ? (
									<a
										href="https://quillforms.com"
										target="_blank"
										rel="noopener noreferrer"
										style={{ textDecoration: 'none', display: 'inline-block' }}
									>
										<CustomButton
											variant="primary"
											text={__('Upgrade to ', 'quillforms') + featurePlanLabel + '!'}
											className="!border-0 !border-none !py-3 !px-24"
										/>
									</a>
								) : (
									<NavLink
										to="/admin.php?page=quillforms&path=checkout"
										style={{ textDecoration: 'none', display: 'inline-block' }}
									>
										<CustomButton
											variant="primary"
											text={__('Upgrade to ', 'quillforms') + featurePlanLabel + '!'}
											className="!border-0 !border-none !py-3 !px-24"
										/>
									</NavLink>
								)
							}
						/>
					);
				})()}
			</CustomModal>
		</div>
	);
};

export default Addons;
