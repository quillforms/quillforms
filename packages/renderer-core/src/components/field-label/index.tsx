/**
 * External Dependencies
 */
import { css } from 'emotion';
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import HtmlParser from '../html-parser';
import { __experimentalUseFieldRenderContext } from '../field-render/context';
import useTheme from '../../hooks/use-theme';

const BlockLabel: React.FC = () => {
	const { attributes } = __experimentalUseFieldRenderContext();
	let label = '...';
	if ( attributes?.label ) label = attributes.label;
	const theme = useTheme();

	return (
		<div
			className={ classnames(
				'renderer-components-block-label',
				css`
					color: ${ theme.questionsColor };
				`
			) }
		>
			<HtmlParser value={ label } />
		</div>
	);
};
export default BlockLabel;
