/**
 * WordPress Dependencies
 */
import { useState, useEffect, useRef } from '@wordpress/element';

/**
 * External Dependencies
 */
import TextareaAutosize from 'react-autosize-textarea';
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

const LongTextOutput = ( props ) => {
	const {
		id,
		isAnimating,
		attributes,
		required,
		setIsValid,
		isActive,
		isFocused,
		isReviewing,
		setIsAnswered,
		next,
		val,
		setVal,
	} = props;
	const [ errMsg, setErrMsg ] = useState( null );
	const [ showErr, setShowErr ] = useState( false );
	const [ shaking, setshaking ] = useState( false );
	const [ simulateFocusStyle, setSimulateFocusStyle ] = useState( true );
	const [ isVisible, setIsVisible ] = useState( false );
	const { setMaxCharacters, maxCharacters } = attributes;
	const elemRef = useRef( null );
	const checkfieldValidation = ( value, enableShaking = true ) => {
		if ( required === true && ( ! value || value === '' ) ) {
			setIsValid( false );
			setErrMsg( 'Please fill this in!' );
		} else if (
			setMaxCharacters &&
			maxCharacters > 0 &&
			value.length > maxCharacters
		) {
			setIsValid( false );
			if ( enableShaking ) setshaking( true );
			setErrMsg( 'Maximum length is ' + maxCharacters + ' characters!' );
		} else {
			setIsValid( true );
			setErrMsg( null );
		}
	};

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

	useEffect( () => {
		setShowErr( false );
		checkfieldValidation( val, false );
	}, [ isReviewing, attributes ] );

	const keyDownHandler = ( e ) => {
		// Enter was pressed without shift key
		if ( e.keyCode === 13 && ! e.shiftKey ) {
			// prevent default behavior
			e.preventDefault();
		}
	};

	const changeHandler = ( e ) => {
		const value = e.target.value;
		setShowErr( false );

		if (
			setMaxCharacters &&
			maxCharacters > 0 &&
			value.length > maxCharacters
		) {
			setshaking( true );
		} else {
			setVal( value );
		}
		checkfieldValidation( value );

		if ( value !== '' ) {
			setIsAnswered( true );
		} else {
			setIsAnswered( false );
		}
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
				role="button"
				tabIndex="-1"
				style={ { outline: 'none' } }
				onKeyDown={ ( e ) => {
					// // // console.log("adfmkw");
					if ( e.key === 'Enter' && e.shiftKey ) {
						e.stopPropagation();
					} else if (
						e.key === 'Enter' &&
						! e.shiftKey &&
						e.target.value !== ''
					) {
						e.stopPropagation();
						// // // console.log("akdgnewrngergui");
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
							<TextareaAutosize
								ref={ elemRef }
								onKeyDown={ keyDownHandler }
								className={
									'question__TextareaField' +
									( simulateFocusStyle ? ' no-border' : '' )
								}
								id={ 'longText-' + id }
								onBlur={ () => {
									checkfieldValidation( val );
								} }
								placeholder="Type your answer here..."
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
export default LongTextOutput;
