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
import useTheme from '../../hooks/use-theme';

const BlockTitle: React.FC = () => {
	const { attributes } = useFieldRenderContext();
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
			<HtmlParser value={ autop( label ) } />
		</div>
	);
};
export default BlockTitle;
