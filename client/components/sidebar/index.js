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
