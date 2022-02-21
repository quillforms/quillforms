/**
 * QuillForms Dependencies
 */
import { useTheme } from '@quillforms/renderer-core';

/**
 * External Dependencies
 */
import { css } from 'emotion';

const DownIcon = ( props ) => {
	const theme = useTheme();
	return (
		<div
			tabIndex="0"
			{ ...props }
			className="block-dropdown-renderer-expand-icon"
		>
			<svg
				stroke="currentColor"
				fill="currentColor"
				strokeWidth="0"
				viewBox="0 0 20 20"
				height="1em"
				width="1em"
				xmlns="http://www.w3.org/2000/svg"
				className={ css`
					fill: ${ theme.answersColor };
				` }
			>
				<path
					fillRule="evenodd"
					d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
					clipRule="evenodd"
				></path>
			</svg>
		</div>
	);
};

export default DownIcon;
