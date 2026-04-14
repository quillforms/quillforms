/**
 * Quill Forms Dependencies
 */
import ConfigAPI from '@quillforms/config';
import { Logo } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useState, useEffect } from '@wordpress/element';

/**
 * External Dependencies
 */
import {
	getAdminPages,
	NavLink,
	withRouter,
	matchPath,
} from '@quillforms/navigation';

/**
 * Internal Dependencies
 */
import './style.scss';
import { forEach, map } from 'lodash';
import SettingsIcon from './settings-icon';
import HomeIcon from './home-icon';
import AddonIcon from './addons-icon';
import LicenseIcon from './license-icon';
import SupportIcon from './support-icon';
import SystemIcon from './system-icon';
import ImportExportIcon from './import-export-icon';
import OpenIcon from '../icon/open-icon';
import CloseIcon from '../icon/close-icon copy';
import AllFormIcon from './all-form-icon';

const clean = ( str ) => {
	return str.replace( 'quillforms', '' ).replace( '&path=', '' );
};

const matchesRegesiteredRoutes = ( path ) => {
	let ret = false;
	forEach( getAdminPages(), ( page ) => {
		const match = matchPath( path, {
			path: page.path,
			exact: true,
			strict: false,
		} );
		ret = true;
		return;
	} );
	return ret;
};

const STORAGE_KEY = 'qf-sidebar-collapsed';

const Sidebar = () => {
	const isWPEnv = ConfigAPI.isWPEnv();

	const [ isCollapsed, setIsCollapsed ] = useState( () => {
		try {
			return localStorage.getItem( STORAGE_KEY ) === 'true';
		} catch {
			return false;
		}
	} );

	useEffect( () => {
		try {
			localStorage.setItem( STORAGE_KEY, String( isCollapsed ) );
		} catch {}
		document.body.setAttribute( 'data-sidebar-collapsed', String( isCollapsed ) );
	}, [ isCollapsed ] );

	// Initialise body attribute on mount so CSS is correct immediately.
	useEffect( () => {
		document.body.setAttribute( 'data-sidebar-collapsed', String( isCollapsed ) );
		return () => document.body.removeAttribute( 'data-sidebar-collapsed' );
	}, [] );

	const getIcon = ( pageSlug ) => {
		if ( pageSlug === 'quillforms' ) return <AllFormIcon />;
		if ( pageSlug === 'quillforms&path=addons' ) return <AddonIcon />;
		if ( pageSlug === 'quillforms&path=license' ) return <LicenseIcon />;
		if ( pageSlug === 'quillforms&path=support' ) return <SupportIcon />;
		if ( pageSlug === 'quillforms&path=system' ) return <SystemIcon />;
		// if ( pageSlug === 'quillforms&path=import-export' ) return <ImportExportIcon />;
		if ( pageSlug === 'quillforms&path=settings' ) return <SettingsIcon />;

	};

	return (
		<div className={ `qf-admin-sidebar${ isCollapsed ? ' is-collapsed' : '' }` }>
			{ /* ── Logo / brand row ── */ }
			<div className="qf-admin-sidebar-logo">
				<div className="qf-admin-sidebar-logo__icon">
					<Logo />
				</div>
				{ ! isCollapsed && (
					<span className="qf-admin-sidebar-logo__text">Quill <span className="qf-admin-sidebar-logo__text-highlight">Forms</span></span>
				) }
				<button
					type="button"
					className="qf-admin-sidebar-toggle"
					onClick={ () => setIsCollapsed( ( v ) => ! v ) }
					title={ isCollapsed ? 'Expand sidebar' : 'Collapse sidebar' }
				>
					{ isCollapsed ? (
						<CloseIcon />
					) : (
						<OpenIcon />
					) }
				</button>
			</div>

			{ /* ── Nav items ── */ }
			<div className="qf-admin-sidebar-nav-items">
				{ map( qfAdmin.submenuPages, ( page, index ) => {
					if ( page[ 2 ] === 'quillforms&path=import-export' ) {
						return null;
					}

					if ( matchesRegesiteredRoutes( '/' + clean( page[ 2 ] ) ) ) {
						return (
							<NavLink
								key={ `page-${ index }` }
								isActive={ ( match, location ) => {
									const searchParams = new URLSearchParams( location.search || '' );
									const currentPage = searchParams.get( 'page' );
									const currentPath = searchParams.get( 'path' );

									// Default state (no path) should highlight "All Forms".
									if ( page[ 2 ] === 'quillforms' ) {
										return currentPage === 'quillforms' && ! currentPath;
									}

									const pagePath = page[ 2 ].split( '&path=' )[ 1 ];
									return currentPage === 'quillforms' && currentPath === pagePath;
								} }
								activeClassName="selected"
								className={ `qf-admin-sidebar-nav-item qf-admin-sidebar-nav-item-${ page[ 2 ].replace( 'quillforms&path=', '' ) }-page` }
								to={ `/admin.php?page=${ page[ 2 ] }` }
								title={ isCollapsed ? page[ 0 ] : undefined }
							>
								<div className="qf-admin-sidebar-nav-item__icon">
									{ getIcon( page[ 2 ] ) }
								</div>
								{ ! isCollapsed && (
									<span className="qf-admin-sidebar-nav-item__label">
										{ page[ 0 ] }
									</span>
								) }
							</NavLink>
						);
					} else {
						return (
							<a
								key={ `page-ext-${ index }` }
								href={ `/admin.php?page=${ page[ 2 ] }` }
								className="qf-admin-sidebar-nav-item"
								target="_blank"
								rel="noreferrer"
							/>
						);
					}
				} ) }
			</div>

			{ ! isWPEnv && ! isCollapsed && (
				<div className="qf-admin-account-summary">
					<h3 className="qf-admin-account-summary__heading">Account Summary</h3>
					<div className="qf-admin-account-summary__content">
						<h3>Responses Collected</h3>
						{ window?.quillformsSaasManagerAdmin?.entriesCount }/{ window?.quillformsSaasManagerAdmin?.entriesLimit }
					</div>
					{ window?.quillformsSaasManagerAdmin?.entriesResetDate && (
						<p className="qf-admin-account-summary__reset-date">
							Resets on { window?.quillformsSaasManagerAdmin.entriesResetDate }
						</p>
					) }
					<NavLink
						className="qf-admin-account-link"
						to="/admin.php?page=quillforms&path=checkout"
					>
						Increase your responses limit
					</NavLink>
				</div>
			) }
		</div>
	);
};

export default withRouter( Sidebar );
