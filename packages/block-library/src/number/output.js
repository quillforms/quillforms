/**
 * WordPress Dependencies
 */
import { useState, useEffect, useRef } from '@wordpress/element';

/**
 * External Dependencies
 */
import { motion } from 'framer-motion';
import VisibilitySensor from 'react-visibility-sensor';

/**
 * Internal Dependencies
 */
import {
	FieldAction,
	QuestionHeader,
	QuestionBody,
} from '@quillforms/renderer-components';

const NumberOutput = ( props ) => {
	const {
		id,
		required,
		isAnimating,
		attributes,
		setIsValid,
		setIsAnswered,
		isReviewing,
		isActive,
		isFocused,
		next,
		val,
		setVal,
	} = props;
	const [ errMsg, setErrMsg ] = useState( null );
	const [ showErr, setShowErr ] = useState( false );
	const [ shaking, setshaking ] = useState( false );
	const { setMax, max, setMin, min } = attributes;
	const [ simulateFocusStyle, setSimulateFocusStyle ] = useState( true );
	const [ isVisible, setIsVisible ] = useState( false );

	const elemRef = useRef();

	const checkfieldValidation = ( value ) => {
		// // // console.log(setMin);
		// // // console.log(min);
		// // // console.log(value);
		// // // console.log(value < min);
		if ( required === true && ( ! value || value === '' ) ) {
			setIsValid( false );
			setErrMsg( 'Please fill this in!' );
		} else if ( isNaN( value ) ) {
			setIsValid( false );
			setErrMsg( 'The field expects numbers only!' );
		} else if ( setMax && max > 0 && value > max ) {
			setIsValid( false );
			setErrMsg( 'Please enter a number less than ' + max );
		} else if ( setMin && min >= 0 && value < min ) {
			setIsValid( false );
			setErrMsg( 'Please enter a number greater than ' + min );
		} else {
			setIsValid( true );
			setErrMsg( null );
		}
	};

	useEffect( () => {
		setShowErr( false );
		checkfieldValidation( val, false );
	}, [ isReviewing, attributes ] );

	useEffect( () => {
		if ( isActive ) {
			if ( isFocused && isAnimating ) {
				setSimulateFocusStyle( true );
				return;
			}
			if ( ! isAnimating && isFocused && isVisible ) {
				elemRef.current.focus();
				setSimulateFocusStyle( false );
			}
		} else {
			elemRef.current.blur();
			setSimulateFocusStyle( true );
		}
	}, [ isActive, isFocused, isAnimating, isVisible ] );

	const changeHandler = ( e ) => {
		const value = e.target.value;
		setShowErr( false );
		if ( isNaN( value ) ) {
			setshaking( true );
			return;
		}
		setVal( parseInt( value ) );

		if ( value !== '' ) {
			setIsAnswered( true );
		} else {
			setIsAnswered( false );
		}
		checkfieldValidation( parseInt( value ) );
	};

	return (
		<motion.div
			initial={ { transform: 'none' } }
			animate={ {
				x: shaking ? [ 0, 3, -3, 3, -3, 3, -3, 3, -3, 0 ] : 0,
			} }
			transition={ { ease: 'linear', duration: 0.4 } }
			onAnimationComplete={ () => setshaking( false ) }
		>
			<div
				tabIndex="-1"
				role="button"
				style={ { outline: 'none' } }
				onKeyDown={ ( e ) => {
					if ( e.key === 'Enter' && e.target.value !== '' ) {
						e.stopPropagation();
						checkfieldValidation( val );
						setShowErr( true );
						next();
					}
				} }
			>
				<QuestionHeader { ...props } />
				<QuestionBody>
					<div className="question__wrapper">
						<VisibilitySensor
							resizeCheck={ true }
							resizeThrottle={ 100 }
							scrollThrottle={ 100 }
							onChange={ ( visible ) => {
								setIsVisible( visible );
							} }
						>
							<input
								className={
									'question__InputField' +
									( simulateFocusStyle ? ' no-border' : '' )
								}
								ref={ elemRef }
								id={ 'number-' + id }
								onBlur={ () => {
									checkfieldValidation( val );
								} }
								placeholder="Type your answer here..."
								type="text"
								onChange={ changeHandler }
								value={ val && val.length > 0 ? val : '' }
							/>
						</VisibilitySensor>
					</div>
					<div style={ { height: '60px', marginTop: '20px' } }>
						{ errMsg && ( showErr || isReviewing ) ? (
							<div className="sf-err-msg">{ errMsg }</div>
						) : (
							<FieldAction
								show={ val && val !== '' }
								clickHandler={ () => {
									checkfieldValidation( val );
									setShowErr( true );
									next();
								} }
							/>
						) }
					</div>
				</QuestionBody>
			</div>
		</motion.div>
	);
};
export default NumberOutput;
