import { motion } from 'framer-motion';

const FieldAction = ( { show, clickHandler, text, next } ) => {
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
				<button
					className="renderer-components-field-action__button"
					onClick={ clickHandler }
				>
					{ text ? text : 'OK' }
				</button>
				<div className="renderer-components-field-action__helper-text">
					press <strong>Enter</strong>
				</div>
			</div>
		</motion.div>
	);
};

export default FieldAction;
