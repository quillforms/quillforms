/**
 * External Dependencies
 */
import classnames from 'classnames';
/**
 * Internal Dependencies
 */
import Button from '../button';
import HTMLParser from '../html-parser';
import { useFieldRenderContext } from '../field-render';
import useBlockTypes from '../../hooks/use-block-types';
import useMessages from '../../hooks/use-messages';

const FieldAction = ( { clickHandler, show } ) => {
	const messages = useMessages();
	const { blockName, isSubmitBtnVisible } = useFieldRenderContext();
	if ( ! blockName ) return null;
	const blockType = useBlockTypes()[ blockName ];
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
					<div className="renderer-core-field-action__helper-text">
						<HTMLParser
							value={ messages[ 'label.hintText.enter' ] }
						/>
					</div>
				</>
			) }
		</div>
	);
};

export default FieldAction;
