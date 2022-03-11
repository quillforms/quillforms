/**
 * WordPress Dependencies
 */
import { Icon } from '@wordpress/components';
import { arrowLeft } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';

/**
 * External Dependencies
 */
import { keys, size } from 'lodash';

/**
 * Internal Dependencies
 */
import { Logo } from '@quillforms/admin-components';
import UserImagePlaceholder from '../user-image-placeholder';
import UserNamePlaceholder from '../user-name-placeholder';

const Header = () => {
	return (
		<div className="qf-admin-header">
			<div className="qf-admin-header__left">
				<Logo />
				<a
					className="qf-admin-header__dashboard-link"
					href={ qfAdmin.adminUrl }
				>
					<Icon icon={ arrowLeft } /> Back to WordPress Dashboard
				</a>
			</div>
			<div className="qf-admin-header__right">
				<div className="qf-admin-header__user-name">
					Howdy, { qfAdmin.current_user_name }
				</div>

				<div className="qf-admin-header__user-image">
					<img
						src={
							qfAdmin.current_user_avatar_url
								? qfAdmin.current_user_avatar_url
								: ''
						}
					/>
				</div>
			</div>
		</div>
	);
};

export default Header;
