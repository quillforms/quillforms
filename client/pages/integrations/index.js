/**
 * QuillForms Dependencies
 */
import { Switch, Route, useRouteMatch } from '@quillforms/navigation';
import { getIntegrationModules } from '@quillforms/form-integrations';
import configApi from '@quillforms/config';

/**
 * WordPress Dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal Dependencies
 */
import './style.scss';
import Home from './home';
import Integration from './integration';
import NotFound from './not-found';

const IntegrationsPage = ( { params } ) => {
	const { id } = params;

	const { path } = useRouteMatch();
	const [ isLoading, setIsLoading ] = useState( true );
	const integrationsModules = getIntegrationModules();

	useEffect( () => {
		apiFetch( {
			path: `/wp/v2/quill_forms/${ id }`,
			method: 'GET',
		} ).then( ( res ) => {
			configApi.setInitialPayload( res );
			setIsLoading( false );
		} );
	}, [] );

	return (
		<div className="quillforms-integrations-page">
			<Switch>
				<Route path={ `${ path }` } exact={ true }>
					<Home isLoading={ isLoading } />
				</Route>
				{ Object.keys( integrationsModules ).map( ( slug ) => {
					return (
						<Route
							key={ slug }
							path={ `${ path }/${ slug }` }
							exact={ true }
						>
							<Integration
								slug={ slug }
								isLoading={ isLoading }
							/>
						</Route>
					);
				} ) }
				<Route path={ `${ path }/*` }>
					<NotFound />
				</Route>
			</Switch>
		</div>
	);
};

export default IntegrationsPage;
