/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * External Dependencies
 */
import { css } from 'emotion';
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import useTheme from '../../hooks/use-theme';

const ProgressBar = ( { totalQuestions } ) => {
	const theme = useTheme();
	const { answered } = useSelect( ( select ) => {
		return {
			answered: select(
				'quillForms/renderer-submission'
			).getAnsweredFieldsLength(),
		};
	} );
	const percent = Math.round( ( answered * 100 ) / totalQuestions );

	return (
		<div className="renderer-core-progress-bar">
			<div className="renderer-core-progress-bar__label">
				{ percent }% completed
			</div>
			<div
				className={ classnames(
					'renderer-core-progress-bar__track',
					css`
						background: ${theme.progressBarBgColor};
					`
				) }
			>
				<div
					className={ classnames(
						'renderer-core-progress-bar__fill',
						css`
							width: ${percent}%;
							background: ${theme.progressBarFillColor};
						`
					) }
				/>
			</div>
		</div>
	);
};

export default ProgressBar;
