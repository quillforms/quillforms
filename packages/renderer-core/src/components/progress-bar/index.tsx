/**
 * External Dependencies
 */
import { css } from 'emotion';
import classnames from 'classnames';
import tinyColor from 'tinycolor2';

/**
 * Internal Dependencies
 */
import { useCurrentTheme, useMessages } from '../../hooks';
import useProgressPerecent from '../../hooks/use-progress-percent';
import { HTMLParser } from '..';

const ProgressBar = () => {
	const theme = useCurrentTheme();
	const percent = useProgressPerecent();
	const messages = useMessages();
	const questionsColor = tinyColor( theme.questionsColor );
	return (
		<div
			className={ classnames(
				'renderer-core-progress-bar',
				css`
					@media ( min-width: 601px ) {
						background-color: ${ questionsColor
							.setAlpha( 0.1 )
							.toString() };
					}
				`
			) }
		>
			<div
				className={ classnames(
					'renderer-core-progress-bar__label',
					css`
						color: ${ theme.questionsColor };
						font-size: 15px;
						@media ( max-width: 600px ) {
							font-size: 13px;
						}
					`
				) }
			>
				<HTMLParser value={ messages[ 'label.progress.percent' ] } />
			</div>
			<div
				className={ classnames(
					'renderer-core-progress-bar__track',
					css`
						background: ${ theme.progressBarBgColor };
					`
				) }
			>
				<div
					className={ classnames(
						'renderer-core-progress-bar__fill',
						css`
							width: ${ percent }%;
							background: ${ theme.progressBarFillColor };
						`
					) }
				/>
			</div>
		</div>
	);
};

export default ProgressBar;
