/**
 * QuillForms Dependencies
 */
import { useTheme } from '@quillforms/renderer-core';

/**
 * External Dependencies
 */
import { css } from 'emotion';

const CloseIcon = ( props ) => {
	const theme = useTheme();
	return (
		<div { ...props } className="block-dropdown-renderer-close-icon">
			<svg
				height="32"
				width="32"
				viewBox="0 0 512 512"
				className={ css`
					fill: ${ theme.answersColor };
				` }
			>
				<g>
					<g>
						<g>
							<polygon
								points="405,136.798 375.202,107 256,226.202 136.798,107 107,136.798 226.202,256 107,375.202 136.798,405 256,285.798
			375.202,405 405,375.202 285.798,256 		"
							>
								<polygon
									points="405,136.798 375.202,107 256,226.202 136.798,107 107,136.798 226.202,256 107,375.202 136.798,405 256,285.798
			375.202,405 405,375.202 285.798,256 		"
								/>
							</polygon>
						</g>
					</g>
				</g>
			</svg>
		</div>
	);
};

export default CloseIcon;
