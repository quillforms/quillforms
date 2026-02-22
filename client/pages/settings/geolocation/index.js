/**
 * QuillForms Dependencies
 */
import { NavLink } from '@quillforms/navigation';

/**
 * WordPress Dependencies
 */
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import draftImage from '../../../../assets/images/draft.png';

const Geolocation = () => {
	return applyFilters(
		'QuillForms.Settings.Geolocation.Render',
		<div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
			{/* Draft image */}
			<img
				src={draftImage}
				alt="Geolocation"
				className="w-auto h-auto max-w-md mb-6"
			/>

			{/* Content */}
			<div className="space-y-2">
				<p className="text-base text-[#334155] m-0 font-medium">
					{__('Geolocation is already available.', 'quillforms')}
				</p>
				<p className="text-base text-[#334155] m-0 leading-relaxed">
					{__('Please activate Autocomplete Address Block addon from ', 'quillforms')}
					<NavLink
						to="/admin.php?page=quillforms&path=addons"
						className="text-[#B2328C] hover:underline font-medium"
					>
						{__('addons page', 'quillforms')}
					</NavLink>
					{__(' to use it.', 'quillforms')}
				</p>
				<p className="text-base text-[#334155] m-0 leading-relaxed">
					{__('Renewing your license is recommended to receive updates for this addon.', 'quillforms')}
				</p>

			</div>
		</div>
	);
};

export default Geolocation;
