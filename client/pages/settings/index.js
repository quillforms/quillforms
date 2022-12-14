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
import Payments from './payments';
import Analytics from './analytics';
import Integrations from './integrations';
import Emails from './emails';
import ReCAPTCHA from './recaptcha';

const Settings = () => {
	const params = new Proxy( new URLSearchParams( window.location.search ), {
		get: ( searchParams, prop ) => searchParams.get( prop ),
	} );

	const Tabs = {
		general: {
			title: 'General',
			render: <General />,
		},
		payments: {
			title: 'Payments',
			render: <Payments />,
		},
		emails: {
			title: 'Emails',
			render: <Emails />,
		},
		integrations: {
			title: 'Integrations',
			render: <Integrations />,
		},
		recaptcha: {
			title: 'reCAPTCHA',
			render: <ReCAPTCHA />,
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
					initialTabName={ params?.tab }
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
