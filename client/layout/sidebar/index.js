/**
 * External Dependencies
 */
import { NavLink, withRouter, match } from 'react-router-dom';

/**
 * Internal Dependencies
 */
import './style.scss';
import Logo from '../logo';
import { map } from 'lodash';

const FullScreenNavBar = ( { formId } ) => {
	return (
		<div className="qf-admin-form-toolbar">
			<div className="qf-admin-fform-toolbar__logo">
				<Logo />
			</div>
			<NavLink
				isActive={ ( match, location ) => {
					if ( location.pathname === `/forms/${ formId }/builder` ) {
						return true;
					}
				} }
				activeClassName="selected"
				to={ `/admin.php?page=quillforms&path=/forms/${ formId }/builder` }
			>
				Design
			</NavLink>
			<NavLink
				isActive={ ( match, location ) => {
					if (
						location.pathname === `/forms/${ formId }/integrations`
					) {
						return true;
					}
				} }
				activeClassName="selected"
				to={ `/admin.php?page=quillforms&path=/forms/${ formId }/integrations` }
			>
				Integrations
			</NavLink>
			<NavLink
				isActive={ ( match, location ) => {
					if ( location.pathname === `/forms/${ formId }/entries` ) {
						return true;
					}
				} }
				activeClassName="selected"
				to={ `/admin.php?page=quillforms&path=/forms/${ formId }/entries` }
			>
				Entries
			</NavLink>
			<NavLink
				isActive={ ( match, location ) => {
					if ( location.pathname === `/forms/${ formId }/reports` ) {
						return true;
					}
				} }
				activeClassName="selected"
				to={ `/admin.php?page=quillforms&path=/forms/${ formId }/reports` }
			>
				Reports
			</NavLink>
		</div>
	);
};

const Sidebar = () => {
	console.log( qfAdmin.submenuPages );
	return (
		<div className="qf-admin-sidebar">
			<div className="qf-admin-sidebar-nav-items">
				{ map( qfAdmin.submenuPages, ( page ) => {
					return (
						<NavLink
							className="qf-admin-sidebar-nav-item"
							to={ `?admin.php/page=${ page[ 2 ] }` }
						>
							{ page[ 0 ] }
						</NavLink>
					);
				} ) }
			</div>
		</div>
	);
};
export default withRouter( Sidebar );
