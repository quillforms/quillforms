/**
 * QuillForms Dependencies
 */
import { getIntegrationModules } from '@quillforms/form-integrations';
import { __ } from '@wordpress/i18n';

/**
 * WordPress Dependencies
 */
import { useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { Icon as IconComponent } from '@wordpress/components';

/**
 * External Dependencies
 */
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import './style.scss';
import Icon from './icon';
import IntegrationModal from './integration-modal';
import CustomTabs from '../../components/custom-tabs';
import CustomSearch from '../../components/custom-search';
import CustomButton from '../../components/custom-button';

// ---------------------------------------------------------------------------
// Category definitions (aligned with Settings → Integrations)
// ---------------------------------------------------------------------------
const CATEGORIES = [
	{
		label: 'Data Management & Export',
		slugs: ['pdf', 'googlesheets', 'webhooks', 'airtable'],
	},
	{
		label: 'Analytics & Tracking',
		slugs: ['googleanalytics', 'matomo', 'facebookpixel', 'googletagmanager'],
	},
	{
		label: 'Email Marketing',
		slugs: [
			'mailchimp',
			'mailerlite',
			'mailpoet',
			'aweber',
			'constantcontact',
			'getresponse',
			'activecampaign',
			'convertkit',
			'moosend',
			'emailoctopus',
			'cleverreach',
			'listmonk',
			'drip',
			'fluentcrm',
			'klaviyo',
			'sendinblue',
		],
	},
	{
		label: 'CRM Integrations',
		slugs: [
			'quillcrm',
			'salesforce',
			'zohocrm',
			'bitrix24',
			'freshsales',
			'agilecrm',
			'capsulecrm',
			'groundhogg',
			'keap',
			'mautic',
			'nethuntcrm',
			'salesflare',
			'hubspot',
			'gohighlevel',
		],
	},
	{
		label: 'Task & Project Management',
		slugs: ['asana', 'clickup', 'trello', 'mondaycom'],
	},
	{
		label: 'Productivity & Automation Tools',
		slugs: ['notion', 'pipedrive', 'slack', 'make', 'zapier'],
	},
	{
		label: 'Communication & Support Platforms',
		slugs: ['discord', 'fluentsupport', 'twilio'],
	},
	{
		label: 'WordPress Integrations',
		slugs: ['wpuserregistration', 'postcreation'],
	},
];

const SLUG_TO_CATEGORY = {};
CATEGORIES.forEach((cat) => {
	cat.slugs.forEach((s) => {
		SLUG_TO_CATEGORY[s.toLowerCase()] = cat.label;
	});
});

const IntegrationsPage = ({ params }) => {
	const [modalIntegration, setModalIntegration] = useState(null);
	const [modalIntegrationConnected, setModalIntegrationConnected] = useState(false);
	const [searchKeyword, setSearchKeyword] = useState('');

	const integrationsModules = getIntegrationModules();

	const hasAnyIntegrations = Object.keys(integrationsModules).length > 0;

	const tabs = [
		{
			name: 'all',
			title: __('All Integrations', 'quillforms'),
		},
		...CATEGORIES.map((cat) => ({
			name: cat.label,
			title: cat.label,
		})),
	];

	const getEntriesForTab = (tabName) =>
		Object.entries(integrationsModules).filter(([slug, integration]) => {
			if (tabName !== 'all') {
				const cat =
					SLUG_TO_CATEGORY[slug.toLowerCase()] ?? 'Other Integrations';
				if (cat !== tabName) {
					return false;
				}
			}

			if (!searchKeyword.trim()) {
				return true;
			}

			const searchTerm = searchKeyword.toLowerCase();

			return (
				integration.title.toLowerCase().includes(searchTerm) ||
				integration.description.toLowerCase().includes(searchTerm) ||
				slug.toLowerCase().includes(searchTerm)
			);
		});

	return (
		<div className="quillforms-integrations-page">
			<CustomTabs
				className="quillforms-integrations-page__tabs"
				tabs={tabs}
				initialTabName="all"
			>
				{(tab) => {
					const entries = getEntriesForTab(tab.name);
					const hasFilteredIntegrations = entries.length > 0;

					return (
						<div className="quillforms-integrations-page__content">
							<div className="quillforms-integrations-page-search">
								<CustomSearch
									value={searchKeyword}
									onChange={(value) => setSearchKeyword(value)}
									placeholder={__(
										'Search for an integration',
										'quillforms'
									)}
								/>
							</div>
							<div className="quillforms-integrations-page__integrations-list">
								{hasAnyIntegrations ? (
									hasFilteredIntegrations ? (
										entries.map(([slug, integration]) => {
											const icon = integration.icon;
											const connected = applyFilters(
												'QuillForms.Integrations.IsConnected',
												false,
												slug
											);
											const isQuillCRM = slug === 'quillcrm';
											return (
												<div
													key={slug}
													className={`quillforms-integrations-page__integration-list-item ${isQuillCRM
														? css`
										position: relative;
										background: linear-gradient(145deg, #ffffff 0%, #f0f7ff 100%) !important;
										border: 2px solid transparent !important;
										background-origin: border-box !important;
										background-clip: padding-box !important;
										box-shadow:
											0 8px 32px rgba(39, 76, 119, 0.15),
											0 0 0 2px #458DC7,
											inset 0 1px 0 rgba(255, 255, 255, 0.8) !important;
										transform: scale(1);
										transition: all 0.3s ease !important;
										overflow: visible !important;
										z-index: 1;

										&:hover {
											transform: scale(1.02);
											box-shadow:
												0 12px 40px rgba(39, 76, 119, 0.2),
												0 0 0 2px #274C77,
												inset 0 1px 0 rgba(255, 255, 255, 0.8) !important;
										}

										.quillforms-integrations-page__integration-module-footer button,
										.quillforms-integrations-page__integration-module-footer button {
											background: linear-gradient(135deg, #274C77 0%, #458DC7 100%) !important;
											border: none !important;
											box-shadow: 0 4px 12px rgba(39, 76, 119, 0.3) !important;
											color: white !important;

											&:hover {
												background: linear-gradient(135deg, #1a3a5c 0%, #3a7ab0 100%) !important;
												box-shadow: 0 6px 16px rgba(39, 76, 119, 0.4) !important;
												color: white !important;
											}
										}
									` : ''}`}
												>
													{isQuillCRM && (
														<div
															className={css`
											position: absolute;
											top: -10px;
											left: 50%;
											transform: translateX(-50%);
											background: linear-gradient(135deg, #274C77 0%, #4F9EF9 100%);
											color: white;
											font-size: 10px;
											font-weight: 700;
											padding: 4px 12px;
											border-radius: 12px;
											text-transform: uppercase;
											letter-spacing: 0.5px;
											box-shadow: 0 2px 8px rgba(39, 76, 119, 0.3);
											white-space: nowrap;
											z-index: 100;
											line-height: 1.4;
										`}
														>
															✨{' '}
															{__(
																'Built by Quill Forms',
																'quillforms'
															)}
														</div>
													)}
													<div
														className="quillforms-integrations-page__integration-module-header"
														style={
															isQuillCRM
																? { marginTop: '8px' }
																: {}
														}
													>
														<div className="quillforms-integrations-page__integration-module-header-left">
															<div
																className={`quillforms-integrations-page__integration-module-icon ${isQuillCRM
																	? css`
												background: linear-gradient(145deg, #e8f4fc 0%, #d0e8f7 100%) !important;
												border-radius: 16px !important;
												padding: 10px !important;
												box-shadow:
													0 4px 12px rgba(39, 76, 119, 0.15),
													inset 0 -2px 4px rgba(39, 76, 119, 0.05) !important;

												svg {
													width: 36px !important;
													height: 36px !important;
													filter: drop-shadow(0 2px 4px rgba(39, 76, 119, 0.2));
												}
											`
																	: ''
																	}`}
															>
																{typeof icon === 'string' ? (
																	<img src={icon} />
																) : (
																	<IconComponent
																		icon={
																			icon?.src
																				? icon.src
																				: icon
																		}
																	/>
																)}
															</div>
															<div
																className={`quillforms-integrations-page__integration-module-title ${isQuillCRM
																	? css`
												background: linear-gradient(135deg, #274C77 0%, #4F9EF9 100%);
												-webkit-background-clip: text;
												-webkit-text-fill-color: transparent;
												background-clip: text;
												font-weight: 700 !important;
												font-size: 18px !important;
											`
																	: ''
																	}`}
															>
																{integration.title}
															</div>
														</div>
														<div className="quillforms-integrations-page__integration-module-footer">
															<CustomButton
																text={
																	connected
																		? __(
																			'Edit Connection',
																			'quillforms'
																		)
																		: __(
																			'Connect',
																			'quillforms'
																		)
																}
																variant={
																	isQuillCRM
																		? 'primary'
																		: 'outlineSecondary'
																}
																onClick={() => {
																	setModalIntegration(slug);
																	setModalIntegrationConnected(connected);
																}}
																className={
																	isQuillCRM
																		? ''
																		: '!py-2 !px-4 !text-sm !rounded-[8px]'
																}
															/>
														</div>
													</div>
													<div className="quillforms-integrations-page__integration-module-desc">
														{integration.description}
													</div>
												</div>
											);
										})
									) : (
										<div
											className={css`
												background: #f0f0f0;
												color: #666;
												padding: 20px;
												border-radius: 5px;
												max-width: 400px;
												margin: auto;
												text-align: center;
												margin-top: 50px;
												border: 1px solid #ddd;
											`}
										>
											{__(
												'No integrations found matching your search.',
												'quillforms'
											)}
										</div>
									)
								) : (
									<div
										className={css`
											background: #e05252;
											color: #fff;
											padding: 10px;
											border-radius: 5px;
											max-width: 300px;
											margin: auto;
											text-align: center;
											margin-top: 100px;
										`}
									>
										{__(
											'No integrations available',
											'quillforms'
										)}
									</div>
								)}
							</div>
						</div>
					);
				}}
			</CustomTabs>
			{modalIntegration && (
				<IntegrationModal
					slug={modalIntegration}
					integration={integrationsModules[modalIntegration]}
					isConnected={modalIntegrationConnected}
					onClose={() => {
						setModalIntegration(null);
						setModalIntegrationConnected(false);
					}}
				/>
			)}
		</div>
	);
};

export default IntegrationsPage;
