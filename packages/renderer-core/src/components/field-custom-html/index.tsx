/**
 * External Dependencies
 */
import { css } from 'emotion';
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import { __experimentalUseFieldRenderContext } from '../field-render/context';
import useBlockTheme from '../../hooks/use-block-theme';

const BlockCustomHTML: React.FC = () => {
	const { attributes } = __experimentalUseFieldRenderContext();
	const theme = useBlockTheme( attributes?.themeId );

	return (
		<>
			{ attributes?.customHTML && (
				<div
					className={ classnames(
						'renderer-components-block-custom-html',
						css`
							color: ${ theme.questionsColor };
						`
					) }
					dangerouslySetInnerHTML={ {
						__html: attributes?.customHTML,
					} }
				></div>
			) }
		</>
	);
};
export default BlockCustomHTML;
