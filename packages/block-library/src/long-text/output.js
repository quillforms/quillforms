/**
 * WordPress Dependencies
 */
import { useState, useEffect, useRef } from '@wordpress/element';

/**
 * External Dependencies
 */
import TextareaAutosize from 'react-autosize-textarea';
import VisibilitySensor from 'react-visibility-sensor';

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
		setIsShaking,
		setShowErr,
		setErrMsgKey,
		val,
		setVal,
	} = props;
	const [ simulateFocusStyle, setSimulateFocusStyle ] = useState( true );
	const [ isVisible, setIsVisible ] = useState( false );
	const { setMaxCharacters, maxCharacters } = attributes;
	const elemRef = useRef( null );

	const checkfieldValidation = ( value, enableShaking = true ) => {
		if ( required === true && ( ! value || value === '' ) ) {
			setIsValid( false );
			setErrMsgKey( 'label.errorAlert.required' );
		} else if (
			setMaxCharacters &&
			maxCharacters > 0 &&
			value.length > maxCharacters
		) {
			setIsValid( false );
			if ( enableShaking ) setIsShaking( true );
			setErrMsgKey( 'label.errorAlert.maxCharacters' );
		} else {
			setIsValid( true );
			setErrMsgKey( null );
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
			setIsShaking( true );
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
	);
};
export default LongTextOutput;
