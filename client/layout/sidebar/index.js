/**
 * External Dependencies
 */
import { NavLink, withRouter, match } from 'react-router-dom';

/**
 * Internal Dependencies
 */
import './style.scss';
import { map } from 'lodash';

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
