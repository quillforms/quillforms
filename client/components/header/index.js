/**
 * Quill Forms Dependencies
 */
import ConfigApi from '@quillforms/config';
/**
 * WordPress Dependencies
 */
import { Icon } from '@wordpress/components';
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
import WordpressIconIcon from './icon/wordpress-icon';

const Header = () => {
	return (
		<div className="qf-admin-header fixed z-[6] top-0 right-0 left-0 w-full flex justify-between items-center p-4 bg-white shadow-[0_4px_40px_0_rgba(87,3,3,0.06)]">
			<div className="qf-admin-header__left flex flex-wrap items-center gap-2">
				{/* <Logo /> */}
				<a
					className="qf-admin-header__dashboard-link flex flex-wrap items-center gap-2 no-underline text-[#B2328C] font-medium text-[18px] leading-7 focus:outline-none focus:ring-0"
					href={qfAdmin.adminUrl}
				>
					<Icon icon={WordpressIconIcon} /> {__('Go to WordPress dashboard', 'quillforms')}
				</a>
			</div>

			<div className="qf-admin-header__right flex flex-wrap items-center gap-2">
				<div className="flex justify-center items-center gap-3 border border-gray-300 bg-[#F2F4FC] rounded-full p-1">
					<div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
						<img
							src={
								qfAdmin.current_user_avatar_url
									? qfAdmin.current_user_avatar_url
									: ''
							}
							className="w-full h-full object-cover"
						/>
					</div>
				</div>

				<div className="text-lg font-medium !text-[#001D4F]">
					{__('Howdy,', 'quillforms')} {qfAdmin.current_user_name}
				</div>
			</div>
		</div>
	);
};

export default Header;
