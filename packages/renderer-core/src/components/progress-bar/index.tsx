/**
 * External Dependencies
 */
import { css } from 'emotion';
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import useTheme from '../../hooks/use-theme';
import useProgressPerecent from '../../hooks/use-progress-percent';

const ProgressBar = () => {
	const theme = useTheme();
	const percent = useProgressPerecent();

	return (
		<div className="renderer-core-progress-bar">
			<div className="renderer-core-progress-bar__label">
				{ percent }% completed
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
