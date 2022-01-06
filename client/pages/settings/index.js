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
import Integrations from './integrations';

const Settings = () => {
	const getTab = ( name ) => {
		switch ( name ) {
			case 'general':
				return <General />;
			case 'integrations':
				return <Integrations />;
			default:
				return <div>Not Found</div>;
		}
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
					tabs={ [
						{
							name: 'general',
							title: 'General',
							className: 'tab-general',
						},
						{
							name: 'integrations',
							title: 'Integrations',
							className: 'tab-integrations',
						},
					] }
				>
					{ ( tab ) => <div>{ getTab( tab.name ) }</div> }
				</TabPanel>
			</div>
		</div>
	);
};

export default Settings;
