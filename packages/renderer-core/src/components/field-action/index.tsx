/**
 * External Dependencies
 */
import classnames from 'classnames';
import { css } from '@emotion/css';

/**
 * Internal Dependencies
 */
import Button from '../button';
import HTMLParser from '../html-parser';
import { __experimentalUseFieldRenderContext } from '../field-render';
import useBlockTypes from '../../hooks/use-block-types';
import useMessages from '../../hooks/use-messages';
import useTheme from '../../hooks/use-theme';

const FieldAction = ( { clickHandler, show } ) => {
	const messages = useMessages();
	const theme = useTheme();
	const {
		blockName,
		isSubmitBtnVisible,
	} = __experimentalUseFieldRenderContext();
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
			{ blockType?.nextBtn ? (
				<blockType.nextBtn onClick={ clickHandler } />
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
