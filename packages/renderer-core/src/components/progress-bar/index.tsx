/**
 * External Dependencies
 */
import { css } from 'emotion';
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import { useTheme, useMessages } from '../../hooks';
import useProgressPerecent from '../../hooks/use-progress-percent';
import { HTMLParser } from '..';

const ProgressBar = () => {
	const theme = useTheme();
	const percent = useProgressPerecent();
	const messages = useMessages();
	return (
		<div className="renderer-core-progress-bar">
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
