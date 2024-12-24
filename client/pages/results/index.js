/**
 * QuillForms Dependencies
 */
import { __experimentalAddonFeatureAvailability } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { TabPanel } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import './styles.scss';
import { EntriesList } from './components/entries-list';
import Insights from './insights';
import FormAnalyticsDemo from './analytics';

const ResultsPage = ({ params }) => {
	let { id } = params;

	const Tabs = {
		responses: {
			title: __('Responses', 'quillforms'),
			render: (
				<EntriesList
					formId={id}
				/>
			),
		},
		insights: {
			title: __('Insights', 'quillforms'),
			render: applyFilters('QuillForms.Entries.Insights.Render', (
				<Insights />
			), id),
		},
		reports: {
			title: __('Analyze Results', 'quillforms'),
			render: (
				applyFilters('QuillForms.Entries.AnalyzeResults.Render', (
					<FormAnalyticsDemo />
				), id)
			),
		},
	};

	return (
		<div className="qf-entries-page">
			<TabPanel
				className={'entries-addon-tabs'}
				activeClass="active-tab"
				tabs={Object.entries(Tabs).map(
					([name, tab]) => {
						return {
							name,
							title: tab.title,
							className: 'tab-' + name,
						};
					}
				)}
			>
				{(tab) => (
					<div
						className={css`
						` }
					>
						<div className="qf-entries-container">
							{Tabs[tab.name]?.render ?? (
								<div>Not Found</div>
							)}
						</div>
					</div>
				)}
			</TabPanel>

		</div>
	);
};

export default ResultsPage;