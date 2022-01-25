/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';

/**
 * External Dependencies
 */
import classNames from 'classnames';
import { css } from 'emotion';
/**
 * Internal Dependencies
 */
import HTMLParser from '../html-parser';
import { __experimentalUseFieldRenderContext } from '../field-render/context';
import useBlockTheme from '../../hooks/use-block-theme';

const BlockDesc: React.FC = () => {
	const { attributes } = __experimentalUseFieldRenderContext();
	if ( ! attributes || ! attributes.description ) return null;
	const theme = useBlockTheme( attributes.themeId );
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
					<HTMLParser value={ description } />
				</div>
			) }
		</Fragment>
	);
};
export default BlockDesc;
