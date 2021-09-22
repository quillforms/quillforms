/**
 * QuillForms Dependencies.
 */
import configApi from '@quillforms/config';
import { Button } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import { isEqual } from 'lodash';

/**
 * Internal Dependencies
 */
import './style.scss';

const Addons = () => {
	const license = configApi.getLicense();
	const [ addons, setAddons ] = useState( configApi.getStoreAddons() );
	const [ apiAction, setApiAction ] = useState( null ); // { action: , addon:  }

	const { createErrorNotice, createSuccessNotice } = useDispatch(
		'core/notices'
	);

	useEffect( () => {
		if ( ! isEqual( addons, configApi.getStoreAddons() ) ) {
			configApi.setStoreAddons( addons );
		}
	}, [ addons ] );

	const api = ( action, addon ) => {
		// prevent doing 2 actions at the same time.
		if ( apiAction ) return;
		setApiAction( { action, addon } );

		const data = new FormData();
		data.append( 'action', `quillforms_addon_${ action }` );
		data.append( '_nonce', window[ 'qfAdmin' ].site_store_nonce );
		data.append( 'addon', addon );

		fetch( `${ window[ 'qfAdmin' ].adminUrl }admin-ajax.php`, {
			method: 'POST',
			credentials: 'same-origin',
			body: data,
		} )
			.then( ( res ) => res.json() )
			.then( ( res ) => {
				if ( res.success ) {
					createSuccessNotice( '✅ ' + res.data, {
						type: 'snackbar',
						isDismissible: true,
					} );
					switch ( action ) {
						case 'activate':
							setAddons( ( addons ) => {
								return {
									...addons,
									[ addon ]: {
										...addons[ addon ],
										is_active: true,
									},
								};
							} );
							break;
						case 'install':
							setAddons( ( addons ) => {
								return {
									...addons,
									[ addon ]: {
										...addons[ addon ],
										is_installed: true,
									},
								};
							} );
							break;
					}
				} else {
					createErrorNotice( `⛔ ${ res.data ?? 'Error' }`, {
						type: 'snackbar',
						isDismissible: true,
					} );
				}
			} )
			.catch( ( err ) => {
				createErrorNotice( `⛔ ${ err ?? 'Error' }`, {
					type: 'snackbar',
					isDismissible: true,
				} );
			} )
			.finally( () => {
				setApiAction( null );
			} );
	};

	const isDoingApiAction = ( action, addon ) => {
		return (
			apiAction &&
			apiAction.action === action &&
			apiAction.addon === addon
		);
	};

	return (
		<div className="quillforms-addons-page">
			<h1 className="quillforms-addons-page__heading">Addons</h1>
			<div className="quillforms-addons-page__body">
				<div className="quillforms-addons-page__body-addons">
					{ Object.entries( addons ).map( ( [ addon, data ] ) => {
						return (
							<div
								key={ addon }
								className="quillforms-addons-page__body-addon"
							>
								<h3>{ data.name }</h3>
								<h4>{ data.description }</h4>
								<div className="quillforms-addons-page__body-addon-footer">
									{ ! data.is_installed ? (
										<Button
											isPrimary
											onClick={ () =>
												api( 'install', addon )
											}
											disabled={ apiAction !== null }
										>
											{ isDoingApiAction(
												'install',
												addon
											)
												? 'Installing...'
												: 'Install' }
										</Button>
									) : ! data.is_active ? (
										<Button
											isPrimary
											onClick={ () =>
												api( 'activate', addon )
											}
											disabled={ apiAction !== null }
										>
											{ isDoingApiAction(
												'activate',
												addon
											)
												? 'Activating...'
												: 'Activate' }
										</Button>
									) : (
										<span className="quillforms-addons-active">
											Active
										</span>
									) }
								</div>
							</div>
						);
					} ) }
				</div>
			</div>
		</div>
	);
};

export default Addons;
