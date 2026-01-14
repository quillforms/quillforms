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
							const isQuillCRM = slug === 'quillcrm';
							return (
								<div
									key={slug}
									className={`quillforms-integrations-page__integration-list-item ${isQuillCRM ? css`
										position: relative;
										background: linear-gradient(145deg, #ffffff 0%, #f0f7ff 100%) !important;
										border: 2px solid transparent !important;
										background-origin: border-box !important;
										background-clip: padding-box !important;
										box-shadow: 
											0 8px 32px rgba(39, 76, 119, 0.15),
											0 0 0 2px #458DC7,
											inset 0 1px 0 rgba(255, 255, 255, 0.8) !important;
										transform: scale(1);
										transition: all 0.3s ease !important;
										overflow: visible !important;
										
										&:hover {
											transform: scale(1.02);
											box-shadow: 
												0 12px 40px rgba(39, 76, 119, 0.2),
												0 0 0 2px #274C77,
												inset 0 1px 0 rgba(255, 255, 255, 0.8) !important;
										}
										
										.quillforms-integrations-page__integration-module-footer button {
											background: linear-gradient(135deg, #274C77 0%, #458DC7 100%) !important;
											border: none !important;
											box-shadow: 0 4px 12px rgba(39, 76, 119, 0.3) !important;
											
											&:hover {
												background: linear-gradient(135deg, #1a3a5c 0%, #3a7ab0 100%) !important;
												box-shadow: 0 6px 16px rgba(39, 76, 119, 0.4) !important;
											}
										}
									` : ''}`}
								>
									{isQuillCRM && (
										<div className={css`
											position: absolute;
											top: -12px;
											left: 50%;
											transform: translateX(-50%);
											background: linear-gradient(135deg, #274C77 0%, #4F9EF9 100%);
											color: white;
											font-size: 11px;
											font-weight: 700;
											padding: 6px 16px;
											border-radius: 20px;
											text-transform: uppercase;
											letter-spacing: 1px;
											box-shadow: 0 4px 12px rgba(39, 76, 119, 0.4);
											white-space: nowrap;
											z-index: 10;
										`}>
											✨ {__('Built by Quill Forms', 'quillforms')}
										</div>
									)}
									<div className="quillforms-integrations-page__integration-module-header" style={isQuillCRM ? { marginTop: '8px' } : {}}>
										<div className={`quillforms-integrations-page__integration-module-icon ${isQuillCRM ? css`
											background: linear-gradient(145deg, #e8f4fc 0%, #d0e8f7 100%) !important;
											border-radius: 16px !important;
											padding: 10px !important;
											box-shadow: 
												0 4px 12px rgba(39, 76, 119, 0.15),
												inset 0 -2px 4px rgba(39, 76, 119, 0.05) !important;
											
											svg {
												width: 36px !important;
												height: 36px !important;
												filter: drop-shadow(0 2px 4px rgba(39, 76, 119, 0.2));
											}
										` : ''}`}>
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
										<div className={`quillforms-integrations-page__integration-module-title ${isQuillCRM ? css`
											background: linear-gradient(135deg, #274C77 0%, #4F9EF9 100%);
											-webkit-background-clip: text;
											-webkit-text-fill-color: transparent;
											background-clip: text;
											font-weight: 700 !important;
											font-size: 18px !important;
										` : ''}`}>
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
