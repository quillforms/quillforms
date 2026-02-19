/**
 * Quill Forms Dependencies
 */
import ConfigAPI from '@quillforms/config';

/**
 * Internal Dependencies
 */
import './style.scss';
import CustomTabs from '../../components/custom-tabs';
import General from './general';
import Payments from './payments';
import Analytics from './analytics';
import Integrations from './integrations';
import Emails from './emails';
import ReCAPTCHA from './recaptcha';
import Geolocation from './geolocation';


const Settings = () => {
	const isWPEnv = ConfigAPI.isWPEnv();
	const params = new Proxy(new URLSearchParams(window.location.search), {
		get: (searchParams, prop) => searchParams.get(prop),
	});

	let Tabs = {
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
		geolocation: {
			title: 'Geolocation',
			render: <Geolocation />,
		},
	};
	// if (!isWPEnv) {
	// 	// keep all tabs but we need general tab to be the last one in case of non WP env
	// 	// remove general tab first
	// 	delete Tabs.general;
	// 	// add it again
	// 	Tabs = {
	// 		...Tabs,
	// 		general: {
	// 			title: 'General',
	// 			render: <General />,
	// 		},
	// 	};
	// }
	return (
		<div className="quillforms-settings-page">
			<h1 className="quillforms-settings-page__heading">Settings</h1>
			<div className="quillforms-settings-page__body">
				<CustomTabs
					className="quillforms-settings-page__tabs"
					tabs={Object.entries(Tabs).map(([name, tab]) => ({
						name,
						title: tab.title,
					}))}
					initialTabName={!isWPEnv ? 'payments' : params?.tab ? params.tab : 'general'}
				>
					{(tab) => (
						<div className="relative bg-[#F7F8FA] border border-border-color rounded-[20px] py-6 px-5 mt-4 min-h-[calc(100vh-150px)]">
							{Tabs[tab.name]?.render ?? <div>Not Found</div>}
						</div>
					)}
				</CustomTabs>
			</div>
		</div>
	);
};

export default Settings;
