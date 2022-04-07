/**
 * WordPress Dependencies
 */
import { Panel, PanelBody } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

/**
 * QuillForms Dependencies
 */
import ConfigAPI from '@quillforms/config';
import { __experimentalAddonFeatureAvailability } from '@quillforms/admin-components';

/**
 * Internal Dependencies
 */
import './style.scss';

const Analytics = () => {
	const StoreAddons = ConfigAPI.getStoreAddons();
	const AnalyticsAddons = [ 'googleanalytics', 'facebookpixel' ];

	return (
		<div className="quillforms-analytics-tab">
			<Panel>
				{ AnalyticsAddons.map( ( slug ) => {
					const addon = StoreAddons[ slug ];
					return (
						<PanelBody
							key={ slug }
							title={
								<div className="quillforms-analytics-tab-addon-header">
									<img src={ addon.assets.icon } />
									<div>{ addon.name }</div>
								</div>
							}
							initialOpen={ false }
							className="quillforms-analytics-tab-addon"
						>
							<div className="quillforms-analytics-tab-addon-body">
								{ applyFilters(
									'QuillForms.Settings.Analytics.SettingsRender',
									<__experimentalAddonFeatureAvailability
										featureName={
											addon.name +
											' ' +
											__( 'Addon', 'quillforms' )
										}
										addonSlug={ slug }
										showLockIcon={ true }
									/>,
									slug
								) }
							</div>
						</PanelBody>
					);
				} ) }
			</Panel>
		</div>
	);
};

export default Analytics;
