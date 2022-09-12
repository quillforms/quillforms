/**
 * External Dependencies
 */
import classnames from 'classnames';
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import useBlockTheme from '../../hooks/use-block-theme';
import HTMLParser from '../html-parser';
import { __experimentalUseFieldRenderContext } from '..';

interface Props {
	message: string;
}
const ErrorMsgWrapper: React.FC< Props > = ( { message } ) => {
	const { attributes } = __experimentalUseFieldRenderContext();
	const theme = useBlockTheme( attributes?.themeId );
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
