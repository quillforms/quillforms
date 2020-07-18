/* eslint-disable no-nested-ternary */
/**
 * External Dependencies
 */
import { motion } from 'framer-motion';
import Loader from 'react-loader-spinner';

const SubmissionScreen = ( {
	submitHandler,
	invalidFields,
	active,
	isReviewing,
	setIsReviewing,
	isSubmitting,
	setIsSubmitting,
	reviewHandler,
} ) => {
	const clickHandler = () => {
		if ( invalidFields.length > 0 ) {
			setIsReviewing( true );
		} else {
			// // // console.log("and the other fucking firing");
			setIsReviewing( false );
			setIsSubmitting( true );
			submitHandler();
		}
	};
	return (
		<div className={ 'submission__screen ' + ( active ? ' active' : '' ) }>
			{ isReviewing && invalidFields.length > 0 && (
				<motion.div
					className={ 'sf-err-msg' }
					initial={ { opacity: 0 } }
					animate={ {
						opacity: active ? 1 : 0,
					} }
					transition={ {
						duration: 0.01,
					} }
				>
					{ invalidFields.length } errors need completing
				</motion.div>
			) }
			<motion.div
				initial={ { opacity: 0, y: 80 } }
				animate={ {
					opacity: active ? 1 : 0,
					y: active ? 0 : 80,
				} }
				transition={ {
					delay: 0.2,
					ease: 'linear',
					duration: 0.3,
				} }
				className="submission__btnWrapper"
			>
				{ ! isSubmitting &&
				( invalidFields.length === 0 || ! isReviewing ) ? (
					<button
						className="submission__btn"
						onClick={ clickHandler }
					>
						Submit
					</button>
				) : isReviewing ? (
					<button
						className="submission__btn"
						onClick={ () => {
							reviewHandler();
						} }
					>
						Review
					</button>
				) : (
					<button className="submission__btn">
						<Loader
							type="TailSpin"
							color="#fff"
							height={ 30 }
							width={ 30 }
						/>
					</button>
				) }
			</motion.div>
		</div>
	);
};
export default SubmissionScreen;
