/**
 * Internal Dependencies
 */
import CustomTabs from '../../components/custom-tabs';
import Status from './status';
import Logs from './logs';
import { __ } from '@wordpress/i18n';

const System = () => {
	const Tabs = {
		status: {
			title: 'Status',
			render: <Status />,
		},
		logs: {
			title: 'Logs',
			render: <Logs />,
		},
	};

	return (
		<div className="quillforms-system-page">
			<h1 className="quillforms-support-page__heading !text-2xl !text-[#001D4F] !font-bold">System</h1>
			<div className="quillforms-system-page__body">
				<CustomTabs
					className="quillforms-system-page__tabs"
					tabs={Object.entries(Tabs).map(([name, tab]) => ({
						name,
						title: tab.title,
					}))}
					initialTabName="status"
				>
					{(tab) => (
						<div className="w-full">
							{Tabs[tab.name]?.render ?? <div>Not Found</div>}
						</div>
					)}
				</CustomTabs>
			</div>
		</div>
	);
};

export default System;
