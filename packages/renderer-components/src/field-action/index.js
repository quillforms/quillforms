import { motion } from 'framer-motion';

/**
 * Internal Dependencies
 */
import useMetaField from '../hooks/use-meta-field';
import Button from '../button';
import HTMLParser from '../html-parser';
import { useFieldRenderContext } from '../field-render';
import useBlockTypes from '../hooks/use-block-types';

const FieldAction = ( { show, clickHandler, next } ) => {
	const messages = useMetaField( 'messages' );
	const { field } = useFieldRenderContext();
	const { type } = field;
	const blockType = useBlockTypes()[ type ];
	console.log( show );
	console.log( blockType.rendererConfig );
	return (
		<motion.div
			initial={ { opacity: 0 } }
			animate={ {
				opacity: show === true ? 'inherit' : 0,
				visibility: show === true ? 'inherit' : 'hidden',
				y: show === true ? 0 : 10,
			} }
			transition={ { ease: 'linear', duration: 0.15 } }
			onKeyDown={ ( e ) => {
				if ( e.key === 'Enter' ) {
					next();
				}
			} }
		>
			<div className="renderer-components-field-action">
				{ blockType?.rendererConfig?.nextBtn ? (
					<blockType.rendererConfig.nextBtn
						onClick={ clickHandler }
					/>
				) : (
					<>
						<Button onClick={ clickHandler }>
							<HTMLParser
								value={ messages[ 'label.button.ok' ] }
							/>
						</Button>
						<div className="renderer-components-field-action__helper-text">
							<HTMLParser
								value={ messages[ 'label.hintText.enter' ] }
							/>
						</div>
					</>
				) }
			</div>
		</motion.div>
	);
};

export default FieldAction;
