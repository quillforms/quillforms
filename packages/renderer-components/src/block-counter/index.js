/**
 * External Dependencies
 */
import { css } from 'emotion';
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import ArrowIcon from './arrow-icon';
import { useFieldRenderContext } from '../field-render/context';
import useBlockTypes from '../hooks/use-block-types';
import useTheme from '../hooks/use-theme';

const BlockCounter = () => {
	const { type, counter } = useFieldRenderContext();
	const blockTypes = useBlockTypes();
	const blockType = blockTypes[ type ];
	const theme = useTheme();
	return (
		<div
			className={ classnames(
				'renderer-components-block-counter',
				css`
					color: ${theme.questionsColor};
				`
			) }
		>
			{ counter !== -1 && (
				<span className="renderer-components-block-counter__value">
					{ counter + 1 }
				</span>
			) }
			<span className="renderer-components-block-counter__content">
				{ blockType?.rendererConfig?.counterContent ? (
					<blockType.rendererConfig.counterContent />
				) : (
					<ArrowIcon />
				) }
			</span>
		</div>
	);
};

export default BlockCounter;
