/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/admin-components';
import { getIntegrationModules } from '@quillforms/form-integrations';
import { __ } from '@wordpress/i18n';

/**
 * WordPress Dependencies
 */
import { useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { Icon as IconComponent } from '@wordpress/components';

/**
 * External Dependencies
 */
import { css } from 'emotion';
import { map, keys, size, filter } from 'lodash';

/**
 * Internal Dependencies
 */
import './style.scss';
import Icon from './icon';
import SearchIcon from './search-icon';
import IntegrationModal from './integration-modal';
import { NavLink } from '@quillforms/navigation';

const IntegrationsPage = ({ params }) => {
	const [modalIntegration, setModalIntegration] = useState(null);
	const [searchKeyword, setSearchKeyword] = useState('');

	const integrationsModules = getIntegrationModules();

	// Filter integrations based on search keyword
	const filteredIntegrationKeys = filter(keys(integrationsModules), (slug) => {
		if (!searchKeyword.trim()) {
			return true; // Show all integrations if no search keyword
		}

		const integration = integrationsModules[slug];
		const searchTerm = searchKeyword.toLowerCase();

		// Search in title, description, and slug
		return (
			integration.title.toLowerCase().includes(searchTerm) ||
			integration.description.toLowerCase().includes(searchTerm) ||
			slug.toLowerCase().includes(searchTerm)
		);
	});

	return (
		<div className="quillforms-integrations-page">
			<div className="quillforms-integrations-page-header">
				<Icon />
				<div className="quillforms-integrations-page-heading">
					<p>{__('Connect your form to your best-loved apps', 'quillforms')} </p>
					<p>
						{__('Establish workflows that work for you. Automate your marketing, sales, and service processes to make your form more efficient', 'quillforms')}
					</p>
				</div>
			</div>

			<div className="quillforms-integrations-page-search">
				<input
					className="quillforms-integrations-page-search__input"
					type="text"
					value={searchKeyword}
					placeholder={__('Search for an integration', 'quillforms')}
					onChange={(e) => {
						setSearchKeyword(e.target.value);
					}}
				/>
				<SearchIcon />
			</div>
			<div className="quillforms-integrations-page__integrations-list">
				{size(integrationsModules) > 0 ? (
					size(filteredIntegrationKeys) > 0 ? (
						map(filteredIntegrationKeys, (slug) => {
							const icon = integrationsModules[slug].icon;
							const connected = applyFilters(
								'QuillForms.Integrations.IsConnected',
								false,
								slug
							);
							return (
								<div
									key={slug}
									className="quillforms-integrations-page__integration-list-item"
								>
									<div className="quillforms-integrations-page__integration-module-header">
										<div className="quillforms-integrations-page__integration-module-icon">
											{typeof icon === 'string' ? (
												<img src={icon} />
											) : (
												<IconComponent
													icon={
														icon?.src ? icon.src : icon
													}
												/>
											)}
										</div>
										<div className="quillforms-integrations-page__integration-module-title">
											{integrationsModules[slug].title}
										</div>
									</div>
									<div className="quillforms-integrations-page__integration-module-desc">
										{integrationsModules[slug].description}
									</div>
									<div className="quillforms-integrations-page__integration-module-footer">
										<Button
											isPrimary
											onClick={() =>
												setModalIntegration(slug)
											}
										>
											{connected ? (
												<span>
													{__('Edit Connection', 'quillforms')}
												</span>
											) : (
												<span>
													{__('Connect', 'quillforms')}
												</span>
											)}
										</Button>
									</div>
								</div>
							);
						})
					) : (
						<div
							className={css`
								background: #f0f0f0;
								color: #666;
								padding: 20px;
								border-radius: 5px;
								max-width: 400px;
								margin: auto;
								text-align: center;
								margin-top: 50px;
								border: 1px solid #ddd;
							`}
						>
							{__('No integrations found matching your search.', 'quillforms')}
						</div>
					)
				) : (
					<div
						className={css`
							background: #e05252;
							color: #fff;
							padding: 10px;
							border-radius: 5px;
							max-width: 300px;
							margin: auto;
							text-align: center;
							margin-top: 100px;
						`}
					>
						{__('No integrations available', 'quillforms')}
					</div>
				)}
			</div>
			{modalIntegration && (
				<IntegrationModal
					slug={modalIntegration}
					integration={integrationsModules[modalIntegration]}
					onClose={() => setModalIntegration(null)}
				/>
			)}
		</div>
	);
};

export default IntegrationsPage;
