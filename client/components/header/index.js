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
	const { currentUser, hasGetCurrentUserFinishedResolution } = useSelect(
		( select ) => {
			return {
				currentUser: select( 'core' ).getCurrentUser(),
				hasGetCurrentUserFinishedResolution: select(
					'core'
				).hasFinishedResolution( 'getCurrentUser' ),
			};
		},
		[]
	);
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
					Howdy,{ ' ' }
					{ ! hasGetCurrentUserFinishedResolution ? (
						<UserNamePlaceholder />
					) : (
						currentUser.name
					) }
				</div>

				<div className="qf-admin-header__user-image">
					{ ! hasGetCurrentUserFinishedResolution ? (
						<UserImagePlaceholder />
					) : (
						<img
							src={
								currentUser.avatar_urls[
									keys( currentUser.avatar_urls )[ 0 ]
								]
							}
						/>
					) }
				</div>
			</div>
		</div>
	);
};

export default Header;
