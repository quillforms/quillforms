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

const FieldAction = ( { show, clickHandler, next } ) => {
	const messages = useMessages();
	const { blockName } = useFieldRenderContext();
	const blockType = useBlockTypes()[ blockName ];
	return (
		<div
			role="presentation"
			className={ classnames( 'renderer-components-field-action', {
				'is-visible': show,
			} ) }
			onKeyDown={ ( e ) => {
				if ( e.key === 'Enter' ) {
					next();
				}
			} }
		>
			{ blockType?.nextBtn ? (
				<blockType.nextBtn onClick={ clickHandler } />
			) : (
				<>
					<Button onClick={ clickHandler }>
						<HTMLParser value={ messages[ 'label.button.ok' ] } />
					</Button>
					<div className="renderer-components-field-action__helper-text">
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
