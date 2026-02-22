/**
 * QuillForms Dependencies.
 */
import { getIntegrationModules } from '@quillforms/form-integrations';
import CustomButton from '../../../components/custom-button';
import CustomSearch from '../../../components/custom-search';
import CustomModal from '../../../components/custom-modal';
/**
 * WordPress Dependencies
 */
import { useState } from '@wordpress/element';
import { Icon as IconComponent } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import './style.scss';

// ---------------------------------------------------------------------------
// Category definitions  (slugs taken directly from class-store.php)
// ---------------------------------------------------------------------------
const CATEGORIES = [
	{
		label: 'Data Management & Export',
		slugs: ['pdf', 'googlesheets', 'webhooks', 'airtable'],
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
		label: 'Email Marketing',
		slugs: [
			'mailchimp', 'mailerlite', 'mailpoet', 'aweber',
			'constantcontact', 'getresponse', 'activecampaign',
			'convertkit', 'moosend', 'emailoctopus', 'cleverreach',
			'listmonk', 'drip', 'fluentcrm', 'klaviyo', 'sendinblue',
		],
	},
	{
		label: 'Communication & Support Platforms',
		slugs: ['discord', 'fluentsupport', 'twilio'],
	},
	{
		label: 'WordPress Integrations',
		slugs: ['wpuserregistration', 'postcreation'],
	},
	{
		label: 'CRM Integrations',
		slugs: [
			'quillcrm', 'salesforce', 'zohocrm', 'bitrix24',
			'freshsales', 'agilecrm', 'capsulecrm', 'groundhogg',
			'keap', 'mautic', 'nethuntcrm', 'salesflare',
			'hubspot', 'gohighlevel',
		],
	},
];

// slug → category label reverse-lookup
const SLUG_TO_CATEGORY = {};
CATEGORIES.forEach((cat) => {
	cat.slugs.forEach((s) => {
		SLUG_TO_CATEGORY[s.toLowerCase()] = cat.label;
	});
});

const EXCLUDED = ['googleanalytics', 'facebookpixel', 'googletagmanager', 'matomo'];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const Integrations = () => {
	const integrationsModules = getIntegrationModules();
	const [openSlug, setOpenSlug] = useState(null);
	const [search, setSearch] = useState('');
	const [activeCategory, setActiveCategory] = useState('all');

	// Modal state
	const openIntegration = openSlug ? integrationsModules[openSlug] : null;

	// 1. Filter excluded + search + active-category
	const allEntries = Object.entries(integrationsModules).filter(
		([slug, integration]) => {
			if (EXCLUDED.includes(slug)) return false;
			if (activeCategory !== 'all') {
				const cat = SLUG_TO_CATEGORY[slug.toLowerCase()] ?? 'Other Integrations';
				if (cat !== activeCategory) return false;
			}
			if (!search.trim()) return true;
			const term = search.toLowerCase();
			return (
				integration.title.toLowerCase().includes(term) ||
				integration.description.toLowerCase().includes(term) ||
				slug.toLowerCase().includes(term)
			);
		}
	);

	// 2. Group into categories
	const grouped = {};
	const categoryOrder = [];
	allEntries.forEach(([slug, integration]) => {
		const cat = SLUG_TO_CATEGORY[slug.toLowerCase()] ?? 'Other Integrations';
		if (!grouped[cat]) {
			grouped[cat] = [];
			categoryOrder.push(cat);
		}
		grouped[cat].push([slug, integration]);
	});

	// 3. Ordered labels (respect CATEGORIES order, then extras)
	const orderedLabels = [
		...CATEGORIES.map((c) => c.label).filter((l) => grouped[l]),
		...categoryOrder.filter((l) => !CATEGORIES.find((c) => c.label === l) && grouped[l]),
	];

	return (
		<div className="min-h-screen box-border">

			{ /* ── Authentication Modal ── */}
			<CustomModal
				isOpen={!!openSlug}
				onClose={() => setOpenSlug(null)}
				title={openIntegration
					? `${__('Authenticate', 'quillforms')} ${openIntegration.title}`
					: ''}
			>
				{openSlug && openIntegration?.settingsRender && (
					<openIntegration.settingsRender slug={openSlug} />
				)}
			</CustomModal>

			{ /* ── Search bar ── */}
			<div className="mb-4">
				<CustomSearch
					value={search}
					onChange={setSearch}
					placeholder={__('Search here', 'quillforms')}
					className="!max-w-full"
				/>
			</div>


			{ /* ── Content ── */}
			{allEntries.length === 0 ? (
				<div className="bg-gray-100 text-gray-500 p-5 rounded-lg max-w-md mx-auto mt-12 text-center border border-gray-200">
					{search
						? __('No integrations found matching your search.', 'quillforms')
						: __('No integrations available.', 'quillforms')}
				</div>
			) : (
				orderedLabels.map((catLabel) => (
					<div
						key={catLabel}
						className="bg-[#fff] rounded-[20px] p-5 border border-border-color mb-6"
					>
						{ /* Section header */}
						<h3 className="text-xl leading-7 text-[#001D4F] !m-0 !px-0  pb-5 border-b border-border-color">
							{catLabel}
						</h3>

						{ /* Cards grid */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-6">
							{grouped[catLabel].map(([slug, integration]) => {
								const icon = integration.icon;
								const connected = applyFilters(
									'QuillForms.Integrations.IsConnected',
									false,
									slug
								);

								return (
									<div
										key={slug}
										className="bg-[#F7F8FA] p-4 border border-border-color rounded-2xl flex flex-col gap-4 transition-shadow hover:shadow-md"
									>
										{ /* Icon + title + button row */}
										<div className="flex items-center gap-2 ">
											{ /* Icon */}
											<div className="w-10 h-10 flex-shrink-0 flex items-center justify-center [&_img]:w-9 [&_img]:h-9 [&_svg]:w-9 [&_svg]:h-9">
												{typeof icon === 'string' ? (
													<img src={icon} alt={integration.title} />
												) : (
													<IconComponent icon={icon?.src ? icon.src : icon} />
												)}
											</div>

											{ /* Title */}
											<span className="flex-1 min-w-0 text-lg font-semibold leading-7 text-[#334155] truncate">
												{integration.title}
											</span>

											{ /* Authenticate / Connected button */}
											<CustomButton
												text={connected
													? __('Connected', 'quillforms')
													: __('Authenticate Account', 'quillforms')}
												onClick={() => setOpenSlug(slug)}
												variant={connected ? 'outline' : 'outlineSecondary'}
												className={[
													'!flex-shrink-0 !text-sm !font-medium !leading-[26px] !py-2 !px-2 !rounded-[8px]',
													connected
														? '!border-green-200 !text-green-600 hover:!bg-green-50'
														: '',
												].join(' ')}
											/>
										</div>

										{ /* Description */}
										<div className=" text-base text-[#777] leading-[26px]">
											{integration.description}
										</div>
									</div>
								);
							})}
						</div>
					</div>
				))
			)}
		</div>
	);
};

export default Integrations;
