/**
 * QuillForms Dependencies.
 */
import ConfigApi from '@quillforms/config';
import {
	Button,
	__experimentalAddonFeatureAvailability,
} from '@quillforms/admin-components';
import { setForceReload } from '@quillforms/navigation';

/**
 * WordPress Dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { Modal } from '@wordpress/components';

/**
 * External Dependencies
 */
import { isEqual } from 'lodash';
import { css } from 'emotion';
import classNames from 'classnames';
/**
 * Internal Dependencies
 */
import './style.scss';

const Addons = () => {
	const [ addons, setAddons ] = useState( ConfigApi.getStoreAddons() );
	const [ apiAction, setApiAction ] = useState( null );
	const [ proModalAddon, setProModalAddon ] = useState( null );

	const { createErrorNotice, createSuccessNotice } = useDispatch(
		'core/notices'
	);

	useEffect( () => {
		if ( ! isEqual( addons, ConfigApi.getStoreAddons() ) ) {
			ConfigApi.setStoreAddons( addons );
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
							// allow the new addons to register their scripts.
							setForceReload( true );
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
								className="quillforms-addons-page_addon"
							>
								<div className="quillforms-addons-page_addon__header">
									<div
										className={ classNames(
											'quillforms-addons-page_addon-icon'
										) }
									>
										<img src={ data.assets.icon } />
									</div>
									<div className="quillforms-addons-page_addon__title">
										{ data.name }
									</div>
								</div>

								<div
									key={ addon }
									className="quillforms-addons-page__body-addon"
								>
									<p>{ data.description }</p>
									<div className="quillforms-addons-page__body-addon-footer">
										{ ! data.is_installed ? (
											<Button
												isPrimary
												onClick={ () => {
													if (
														ConfigApi.isPlanAccessible(
															data.plan
														)
													) {
														api( 'install', addon );
													} else {
														setProModalAddon(
															addon
														);
													}
												} }
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
							</div>
						);
					} ) }
				</div>
			</div>
			{ proModalAddon && (
				<Modal
					className={ css`
						border: none !important;
						border-radius: 9px;

						.components-modal__header {
							background: linear-gradient(
								42deg,
								rgb( 235 54 221 ),
								rgb( 238 142 22 )
							);
							h1 {
								color: #fff;
							}
							svg {
								fill: #fff;
							}
						}
						.components-modal__content {
							text-align: center;
						}
					` }
					title={ addons[ proModalAddon ].name + ' is a pro addon' }
					onRequestClose={ () => {
						setProModalAddon( null );
					} }
				>
					<__experimentalAddonFeatureAvailability
						featureName={ addons[ proModalAddon ].name + ' addon' }
						addonSlug={ proModalAddon }
						showLockIcon={ true }
					/>
				</Modal>
			) }
		</div>
	);
};

export default Addons;
