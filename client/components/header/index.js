/**
 * Quill Forms Dependencies
 */
import ConfigApi from '@quillforms/config';
/**
 * WordPress Dependencies
 */
import { Icon } from '@wordpress/components';
import { arrowLeft } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { css } from 'emotion';

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
					href={qfAdmin.adminUrl}
				>
					<Icon icon={arrowLeft} /> {__('Back to WordPress Dashboard', 'quillforms')}
				</a>
			</div>
			<div className="qf-admin-header__right">
				<div className="qf-admin-header__user-name">
					{__('Howdy,', 'quillforms')} {qfAdmin.current_user_name}
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
