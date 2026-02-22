/**
 * QuillForms Dependencies.
 */
import ConfigAPI from '@quillforms/config';
import { __experimentalAddonFeatureAvailability } from '@quillforms/admin-components';
import { NavLink } from '@quillforms/navigation';
import CustomButton from '../../../components/custom-button';
import CustomModal from '../../../components/custom-modal';
import lockImage from '../../../../assets/images/lock.png';

/**
 * WordPress Dependencies
 */
import { useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';


const Analytics = () => {
	const StoreAddons = ConfigAPI.getStoreAddons();
	const AnalyticsAddons = ['googleanalytics', 'matomo', 'facebookpixel', 'googletagmanager'];

	const [openSlug, setOpenSlug] = useState(null);

	// Get all available addons
	const filteredAddons = AnalyticsAddons.filter((slug) => {
		const addon = StoreAddons[slug];
		return !!addon;
	});

	const openAddon = openSlug ? StoreAddons[openSlug] : null;

	return (
		<div className="quillforms-analytics-tab">
			{/* Authentication Modal */}
			<CustomModal
				isOpen={!!openSlug}
				onClose={() => setOpenSlug(null)}
				title={openAddon
					? `${__('Authenticate', 'quillforms')} ${openAddon.name}`
					: ''}
			>
				{openSlug && openAddon && (() => {
					const isWPEnv = ConfigAPI.isWPEnv();
					const featurePlanLabel = ConfigAPI.getPlans()?.['basic']?.label || __('Basic', 'quillforms');

					return (
						<div>
							{applyFilters(
								'QuillForms.Settings.Analytics.SettingsRender',
								<__experimentalAddonFeatureAvailability
									featureName={
										openAddon.name +
										' ' +
										__('Addon', 'quillforms')
									}
									addonSlug={openSlug}
									showLockIcon={true}
									customIcon={
										<img
											src={lockImage}
											alt="Lock icon"
											className="block mx-auto w-28 h-28 object-contain"
										/>
									}
									customDescription={
										<p className="text-[15px] text-[#334155] m-0 mb-5 text-center">
											{__("We're sorry, ", 'quillforms')}
											{openAddon.name}
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
												className="no-underline inline-block"
											>
												<CustomButton
													variant="primary"
													text={`${__('Upgrade to', 'quillforms')} ${featurePlanLabel}!`}
													className="!border-0 !border-none !py-3 !px-24"
												/>
											</a>
										) : (
											<NavLink
												to="/admin.php?page=quillforms&path=checkout"
												className="no-underline inline-block"
											>
												<CustomButton
													variant="primary"
													text={`${__('Upgrade to', 'quillforms')} ${featurePlanLabel}!`}
													className="!border-0 !border-none !py-3 !px-24"
												/>
											</NavLink>
										)
									}
								/>,
								openSlug
							)}
						</div>
					);
				})()}
			</CustomModal>

			{/* Content */}
			{filteredAddons.length === 0 ? (
				<div className="bg-gray-100 text-gray-500 p-5 rounded-lg max-w-md mx-auto mt-12 text-center border border-gray-200">
					{__('No analytics available.', 'quillforms')}
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
					{filteredAddons.map((slug) => {
						const addon = StoreAddons[slug];
						if (!addon) return null;

						const connected = applyFilters(
							'QuillForms.Integrations.IsConnected',
							false,
							slug
						);

						return (
							<div
								key={slug}
								className="bg-[#fff] p-5 border border-border-color rounded-2xl flex flex-col gap-4 transition-shadow hover:shadow-md"
							>
								{/* Icon + title + button row */}
								<div className="flex items-center justify-between gap-3">
									{/* Icon + Title */}
									<div className="flex items-center gap-3 flex-1 min-w-0">
										<div className="w-12 h-12 flex-shrink-0 flex items-center justify-center [&_img]:w-10 [&_img]:h-10 [&_svg]:w-10 [&_svg]:h-10">
											<img src={addon.assets?.icon} alt={addon.name} />
										</div>
										<span className="text-lg font-semibold leading-7 text-[#334155] truncate">
											{addon.name}
										</span>
									</div>

									{/* Authenticate / Connected button */}
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

								{/* Description */}
								<div className="text-base text-[#777] leading-[26px]">
									{addon.description || __('Track user activity and behavior.', 'quillforms')}
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default Analytics;
