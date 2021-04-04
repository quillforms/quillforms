/**
 * External Dependencies
 */
import classnames from 'classnames';
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import useTheme from '../../hooks/use-theme';
import HTMLParser from '../html-parser';

interface Props {
	message: string;
}
const ErrorMsgWrapper: React.FC< Props > = ( { message } ) => {
	const theme = useTheme();
	return (
		<div
			className={ classnames(
				'renderer-components-error-message-wrapper',
				css`
					background: ${ theme.errorsBgColor };
					color: ${ theme.errorsFontColor };
				`
			) }
		>
			<HTMLParser value={ message } />
		</div>
	);
};
export default ErrorMsgWrapper;
