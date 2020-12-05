/**
 * WordPress Dependencies
 */
import { autop } from '@wordpress/autop';

/**
 * External Dependencies
 */
import { css } from 'emotion';
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import HtmlParser from '../html-parser';
import { useFieldRenderContext } from '../field-render/context';
import useTheme from '../hooks/use-theme';

const BlockTitle = () => {
	let { title } = useFieldRenderContext();
	const theme = useTheme();
	if ( ! title ) {
		title = '...';
	}
	return (
		<div
			className={ classnames(
				'renderer-components-block-title',
				css`
					color: ${theme.questionsColor};
				`
			) }
		>
			<HtmlParser
				className="renderer-components-block-title__content"
				value={ autop( title ) }
			/>
		</div>
	);
};
export default BlockTitle;
