/**
 * WordPress Dependencies
 */
import { Tooltip } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
/**
 * Internal Dependencies
 */
import EyeIcon from './eye-icon';

const FullPreviewIcon = ({ isResolving, setFullPreviewMode }) => {
	return (
		<>
			{/* Same visibility rule as Save — do not depend on theme resolution after route changes */}
			{!isResolving && (
				<Tooltip
					text={__('Preview', 'quillforms')}
					position="bottom center"
				>
					<button
						type="button"
						className="qf-builder-full-preview-button"
						onClick={() => {
							setFullPreviewMode(true);
						}}
					>
						<EyeIcon />
					</button>
				</Tooltip>
			)}
		</>
	);
};

export default FullPreviewIcon;
