/**
 * External dependencies
 */
import classnames from 'classnames';
import { css } from 'emotion';
/**
 * Internal Dependencies
 */
import useTheme from '../hooks/use-theme';

const Button = ( { className, onClick, children } ) => {
	const theme = useTheme();
	return (
		<div
			className={ classnames(
				'renderer-components-button',
				className,
				css`
					background: ${theme.buttonsBgColor};
					color: ${theme.buttonsFontColor};
				`
			) }
			role="presentation"
			onClick={ onClick }
		>
			{ children }
		</div>
	);
};

export default Button;
