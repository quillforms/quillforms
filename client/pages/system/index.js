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
import Status from './status';
import Logs from './logs';

const System = () => {
	const getTab = ( name ) => {
		switch ( name ) {
			case 'status':
				return <Status />;
			case 'logs':
				return <Logs />;
			default:
				return <div>Not Found</div>;
		}
	};

	return (
		<div className="quillforms-system-page">
			<h1 className="quillforms-system-page__heading">System</h1>
			<div className="quillforms-system-page__body">
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
							name: 'status',
							title: 'Status',
							className: 'tab-status',
						},
						{
							name: 'logs',
							title: 'Logs',
							className: 'tab-logs',
						},
					] }
				>
					{ ( tab ) => <div>{ getTab( tab.name ) }</div> }
				</TabPanel>
			</div>
		</div>
	);
};

export default System;
