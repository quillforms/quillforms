/**
 * External Dependencies
 */
import classnames from 'classnames';
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import useTheme from '../../hooks/use-theme';

const ErrorMsgWrapper = ( { message } ) => {
	const theme = useTheme();
	return (
		<div
			className={ classnames(
				'renderer-components-error-message-wrapper',
				css`
					background: ${theme.errorsBgColor};
					color: ${theme.errorsFontColor};
				`
			) }
		>
			{ message }
		</div>
	);
};
export default ErrorMsgWrapper;
