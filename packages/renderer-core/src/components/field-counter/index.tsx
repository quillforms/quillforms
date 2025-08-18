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
import ArrowIcon from './arrow-icon';
import useBlockTheme from '../../hooks/use-block-theme';

const BlockCounter = ({ blockType, attributes, id }) => {
	const theme = useBlockTheme(attributes?.themeId);
	const { counter } = useSelect((select) => {
		return {
			counter: select('quillForms/renderer-core').getBlockCounterValue(
				id
			),
		};
	});

	return (
		<div
			className={classnames(
				'renderer-components-block-counter',
				css`
					color: ${theme.questionsColor};
					font-family: ${theme.questionsLabelFont};
					display: flex;
					align-items: center;
					font-size: 16px;
					
					@media (max-width: 767px) {
						font-size: 14px;
					}
					
					@media ( min-width: 768px ) {
						line-height: ${theme.questionsLabelLineHeight.lg} !important;
					}
					@media ( max-width: 767px ) {
						line-height: ${theme.questionsLabelLineHeight.sm} !important;
					}
				`
			)}
		>
			{counter !== undefined && (
				<span className="renderer-components-block-counter__value">
					{counter + 1}
				</span>
			)}
			<span className="renderer-components-block-counter__content">
				{blockType?.counterIcon ? (
					<blockType.counterIcon />
				) : (
					<ArrowIcon theme={theme} />
				)}
			</span>
		</div>
	);
};

export default BlockCounter;