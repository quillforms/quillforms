/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/admin-components';
import { getIntegrationModules } from '@quillforms/form-integrations';
import configApi from '@quillforms/config';

/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { Icon as IconComponent } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

/**
 * External Dependencies
 */
import { css } from 'emotion';
import { map, keys, size } from 'lodash';

/**
 * Internal Dependencies
 */
import './style.scss';
import Icon from './icon';
import SearchIcon from './search-icon';
import IntegrationModal from './integration-modal';

const IntegrationsPage = ( { params } ) => {
	const { id } = params;

	const [ isLoading, setIsLoading ] = useState( true );
	const [ modalIntegration, setModalIntegration ] = useState( null );
	const [ searchKeyword, setSearchKeyword ] = useState( '' );
	const { invalidateResolutionForStore } = useDispatch( 'core/data' );

	const integrationsModules = getIntegrationModules();

	const invalidateResolutionForAllConnectedStores = () => {
		// Invalidate resolution for all connected stores.
		for ( const integration of Object.values( integrationsModules ) ) {
			for ( const store of integration.connectedStores ) {
				if (
					store &&
					wp.data.RegistryConsumer._currentValue.stores[ store ]
				) {
					invalidateResolutionForStore( store );
				}
			}
		}
	};

	useEffect( () => {
		apiFetch( {
			path: `/wp/v2/quill_forms/${ id }`,
			method: 'GET',
		} ).then( ( res ) => {
			configApi.setInitialPayload( res );
			setIsLoading( false );
		} );

		return () => {
			setTimeout( invalidateResolutionForAllConnectedStores );
		};
	}, [] );

	if ( isLoading ) {
		return <div>Loading...</div>;
	}

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
							<div
								key={ slug }
								className="quillforms-integrations-page__integration-list-item"
							>
								<div className="quillforms-integrations-page__integration-module-header">
									<div className="quillforms-integrations-page__integration-module-icon">
										{ typeof icon === 'string' ? (
											<img src={ icon } />
										) : (
											<IconComponent
												icon={
													icon?.src ? icon.src : icon
												}
											/>
										) }
									</div>
									<div className="quillforms-integrations-page__integration-module-title">
										{ integrationsModules[ slug ].title }
									</div>
								</div>
								<div className="quillforms-integrations-page__integration-module-desc">
									{ integrationsModules[ slug ].description }
								</div>
								<Button
									className={ css`
										margin-top: 15px;
										border-radius: 20px !important;
									` }
									isPrimary
									onClick={ () =>
										setModalIntegration( slug )
									}
								>
									Connect
								</Button>
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
			{ modalIntegration && (
				<IntegrationModal
					slug={ modalIntegration }
					integration={ integrationsModules[ modalIntegration ] }
					onClose={ () => setModalIntegration( null ) }
				/>
			) }
		</div>
	);
};

export default IntegrationsPage;
