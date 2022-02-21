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
const Sidebar = () => {
	return (
		<div className="qf-admin-sidebar">
			<h1 className="qf-admin-sidebar-heading">Quill Forms</h1>
			<div className="qf-admin-sidebar-nav-items">
				{ map( qfAdmin.submenuPages, ( page, index ) => {
					if (
						matchesRegesiteredRoutes( '/' + clean( page[ 2 ] ) )
					) {
						return (
							<NavLink
								key={ `page-${ index }` }
								isActive={ ( match, location ) => {
									if (
										( location.pathname ===
											clean( page[ 2 ] ) ) |
										( location.pathname ===
											'/' + clean( page[ 2 ] ) )
									) {
										return true;
									}
								} }
								activeClassName="selected"
								className="qf-admin-sidebar-nav-item"
								to={ `/admin.php?page=${ page[ 2 ] }` }
							>
								<div className="qf-admin-sidebar-nav-item__icon">
									{ page[ 2 ] === 'quillforms' ? (
										<HomeIcon />
									) : page[ 2 ] ===
									  'quillforms&path=addons' ? (
										<AddonIcon />
									) : page[ 2 ] ===
									  'quillforms&path=license' ? (
										<LicenseIcon />
									) : page[ 2 ] ===
									  'quillforms&path=support' ? (
										<SupportIcon />
									) : page[ 2 ] ===
									  'quillforms&path=system' ? (
										<SystemIcon />
									) : (
										<SettingsIcon />
									) }
								</div>
								{ page[ 0 ] }
							</NavLink>
						);
					} else {
						return (
							<a
								href={ `/admin.php?page=${ page[ 2 ] }` }
								className="qf-admin-sidebar-nav-item"
								target="_blank"
							/>
						);
					}
				} ) }
			</div>
		</div>
	);
};
export default withRouter( Sidebar );
