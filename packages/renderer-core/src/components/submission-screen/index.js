/* eslint-disable no-nested-ternary */
/**
 * External Dependencies
 */
import { Button } from '@quillforms/renderer-components';
import { motion } from 'framer-motion';
import Loader from 'react-loader-spinner';

import classnames from 'classnames';
const SubmissionScreen = ( { active } ) => {
	return (
		<div
			className={ classnames( 'submission__screen', {
				active: active === true,
				inactive: active === false,
			} ) }
		>
			{
				// <motion.div
				// 	className={ 'sf-err-msg' }
				// 	initial={ { opacity: 0 } }
				// 	animate={ {
				// 		opacity: active ? 1 : 0,
				// 	} }
				// 	transition={ {
				// 		duration: 0.01,
				// 	} }
				// >
				// 	{ invalidFields.length } errors need completing
				// </motion.div>
			 }
			<div className="submission__btnWrapper">
				<Button className="submission__btn">Submit</Button>
				{ /* <Loader
					type="TailSpin"
					color="#fff"
					height={ 30 }
					width={ 30 }
				/> */ }
			</div>
		</div>
	);
};
export default SubmissionScreen;
