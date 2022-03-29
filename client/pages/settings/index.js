/**
 * WordPress Dependencies
 */
import { TabPanel } from '@wordpress/components';

/**
 * External Dependencies
 */
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import './style.scss';
import General from './general';
import Analytics from './analytics';
import Integrations from './integrations';

const Settings = () => {
	const Tabs = {
		general: {
			title: 'General',
			render: <General />,
		},
		integrations: {
			title: 'Integrations',
			render: <Integrations />,
		},
		analytics: {
			title: 'Tracking & Analytics',
			render: <Analytics />,
		},
	};

	return (
		<div className="quillforms-settings-page">
			<h1 className="quillforms-settings-page__heading">Settings</h1>
			<div className="quillforms-settings-page__body">
				<TabPanel
					className={ css`
						.components-tab-panel__tabs-item {
							font-weight: normal;
						}
						.active-tab {
							font-weight: bold;
						}
					` }
					activeClass="active-tab"
					tabs={ Object.entries( Tabs ).map( ( [ name, tab ] ) => {
						return {
							name,
							title: tab.title,
							className: 'tab-' + name,
						};
					} ) }
				>
					{ ( tab ) => (
						<div>
							{ Tabs[ tab.name ]?.render ?? <div>Not Found</div> }
						</div>
					) }
				</TabPanel>
			</div>
		</div>
	);
};

export default Settings;
