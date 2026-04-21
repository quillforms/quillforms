/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';

const Header = () => {
	return (
		<div className="qf-admin-header fixed z-[5] top-0 right-0 h-[56px] flex justify-end items-center p-4 shadow-[0_4px_40px_0_rgba(87,3,3,0.06)]" >
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

				<div className="text-sm font-medium !text-[#334155]">
					{__('Howdy,', 'quillforms')} {qfAdmin.current_user_name}
				</div>
			</div>
		</div>
	);
};

export default Header;
