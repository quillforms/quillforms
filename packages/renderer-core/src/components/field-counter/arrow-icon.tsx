/**
 * External Dependencies
 */
import { css } from 'emotion';
import classnames from 'classnames';

const ArrowIcon = ( { theme } ) => {
	return (
		<svg
			className={ classnames(
				'renderer-components-block-counter__arrow-icon',
				css`
					fill: ${ theme.questionsColor };
					stroke: ${ theme.questionsColor };
				`
			) }
			focusable="false"
			viewBox="0 0 24 24"
			aria-hidden="true"
			role="presentation"
		>
			<path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
		</svg>
	);
};

export default ArrowIcon;
