/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { createPortal } from '@wordpress/element';
import { Tooltip } from '@wordpress/components';
/**
 * Internal Dependencies
 */
import EyeIcon from './eye-icon';

const FullPreviewIcon = ( { isResolving, setFullPreviewMode } ) => {
	const { hasThemesFinishedResolution } = useSelect( ( select ) => {
		const { hasFinishedResolution } = select( 'quillForms/theme-editor' );

		return {
			hasThemesFinishedResolution:
				hasFinishedResolution( 'getThemesList' ),
		};
	} );

	return (
		<>
			{ createPortal(
				<>
					{ ! isResolving && hasThemesFinishedResolution && (
						<Tooltip text={ 'Preview' } position="bottom center">
							<button
								className="qf-builder-full-preview-button"
								onClick={ () => {
									setFullPreviewMode( true );
								} }
							>
								<EyeIcon />
							</button>
						</Tooltip>
					) }
				</>,
				document.body
			) }
		</>
	);
};

export default FullPreviewIcon;
