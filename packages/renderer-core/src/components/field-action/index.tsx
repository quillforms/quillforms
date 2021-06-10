/**
 * External Dependencies
 */
import classnames from 'classnames';
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import Button from '../button';
import HTMLParser from '../html-parser';
import { useFieldRenderContext } from '../field-render';
import useBlockTypes from '../../hooks/use-block-types';
import useMessages from '../../hooks/use-messages';
import useTheme from '../../hooks/use-theme';

const FieldAction = ( { clickHandler, show } ) => {
	const messages = useMessages();
	const theme = useTheme();
	const { blockName, isSubmitBtnVisible } = useFieldRenderContext();
	if ( ! blockName ) return null;
	const blockType = useBlockTypes()[ blockName ];
	const isTouchScreen =
		'ontouchstart' in window ||
		navigator.maxTouchPoints > 0 ||
		navigator.msMaxTouchPoints > 0;

	return (
		<div
			className={ classnames( 'renderer-core-field-action', {
				'is-visible': isSubmitBtnVisible || show,
			} ) }
		>
			{ blockType?.blockAction ? (
				<blockType.blockAction onClick={ clickHandler } />
			) : (
				<>
					<Button onClick={ clickHandler }>
						<HTMLParser value={ messages[ 'label.button.ok' ] } />
					</Button>
					{ ! isTouchScreen && (
						<div
							className={ classnames(
								'renderer-core-field-action__helper-text',
								css`
									color: ${ theme.questionsColor };
									font-size: 15px;
								`
							) }
						>
							<HTMLParser
								value={ messages[ 'label.hintText.enter' ] }
							/>
						</div>
					) }
				</>
			) }
		</div>
	);
};

export default FieldAction;
