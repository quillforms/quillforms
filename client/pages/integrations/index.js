/**
 * QuillForms Dependencies
 */
import { getIntegrationModules } from '@quillforms/form-integrations';
import { Button } from '@quillforms/admin-components';
/**
 * WordPress Dependencies
 */
import { useState } from '@wordpress/element';
import { Icon as IconComponent } from '@wordpress/components';

/**
 * External Dependencies
 */
import { css } from 'emotion';
import { map, keys, size } from 'lodash';

/**
 * Internal Dependencies
 */
import Icon from './icon';
import SearchIcon from './search-icon';
import './style.scss';
import ConnectButton from './connect-button';

const IntegrationsPage = () => {
	const integrationsModules = getIntegrationModules();
	const [ searchKeyword, setSearchKeyword ] = useState( '' );
	return (
		<div className="quillforms-integrations-page">
			<div className="quillforms-integrations-page-header">
				<Icon />
				<div className="quillforms-integrations-page-heading">
					<p>Connect your form to your best-loved apps </p>
					<p>
						Establish workflows that work for you. Automate your
						marketing, sales, and service processes to make your
						form more efficient
					</p>
				</div>
			</div>

			<div className="quillforms-integrations-page-search">
				<input
					className="quillforms-integrations-page-search__input"
					type="text"
					value={ searchKeyword }
					placeholder={ 'Search Integrations' }
					onChange={ ( e ) => {
						setSearchKeyword( e.target.value );
					} }
				/>
				<SearchIcon />
			</div>

			<div className="quillforms-integrations-page__integrations-list">
				{ size( integrationsModules ) > 0 ? (
					map( keys( integrationsModules ), ( slug ) => {
						const icon = integrationsModules[ slug ].icon;
						return (
							<div className="quillforms-integrations-page__integration-list-item">
								<div className="quillforms-integrations-page__integration-module-header">
									<div className="quillforms-integrations-page__integration-module-icon">
										<IconComponent
											icon={ icon?.src ? icon.src : icon }
										/>
									</div>
									<div className="quillforms-integrations-page__integration-module-title">
										{ integrationsModules[ slug ].title }
									</div>
								</div>
								<div className="quillforms-integrations-page__integration-module-desc">
									{ integrationsModules[ slug ].description }
								</div>
								<ConnectButton slug={ slug } />
							</div>
						);
					} )
				) : (
					<div
						className={ css`
							background: #e05252;
							color: #fff;
							padding: 10px;
							border-radius: 5px;
							max-width: 300px;
							margin: auto;
							text-align: center;
							margin-top: 100px;
						` }
					>
						No integrations found!
					</div>
				) }
			</div>
		</div>
	);
};

export default IntegrationsPage;
