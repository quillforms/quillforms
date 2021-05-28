/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';
import { autop } from '@wordpress/autop';

/**
 * External Dependencies
 */
import classNames from 'classnames';
import { css } from 'emotion';
/**
 * Internal Dependencies
 */
import HTMLParser from '../html-parser';
import { useFieldRenderContext } from '../field-render/context';
import useTheme from '../../hooks/use-theme';

const BlockDesc: React.FC = () => {
	const { attributes } = useFieldRenderContext();
	if ( ! attributes || ! attributes.description ) return null;
	const theme = useTheme();
	const { description } = attributes;
	return (
		<Fragment>
			{ description && description !== '' && (
				<div
					className={ classNames(
						'renderer-components-block-description',
						css`
							color: ${ theme.questionsColor };
						`
					) }
				>
					<HTMLParser value={ autop( description ) } />
				</div>
			) }
		</Fragment>
	);
};
export default BlockDesc;
