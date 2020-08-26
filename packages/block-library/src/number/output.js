/**
 * WordPress Dependencies
 */
import { useState, useEffect, useRef } from '@wordpress/element';

/**
 * External Dependencies
 */
import VisibilitySensor from 'react-visibility-sensor';

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
		val,
		setVal,
		setErrMsgKey,
		setShowErr,
		setIsShaking,
	} = props;
	const { setMax, max, setMin, min } = attributes;
	const [ simulateFocusStyle, setSimulateFocusStyle ] = useState( true );
	const [ isVisible, setIsVisible ] = useState( false );

	const elemRef = useRef();

	const checkfieldValidation = ( value ) => {
		if ( required === true && ( ! value || value === '' ) ) {
			setIsValid( false );
			setErrMsgKey( 'label.errorAlert.required' );
		} else if ( setMax && max > 0 && value > max ) {
			setIsValid( false );
			setErrMsgKey( 'label.errorAlert.maxNum' );
		} else if ( setMin && min >= 0 && value < min ) {
			setIsValid( false );
			setErrMsgKey( 'label.errorAlert.minNum' );
		} else {
			setIsValid( true );
			setErrMsgKey( null );
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
		checkfieldValidation( value );
		if ( isNaN( value ) ) {
			setIsShaking( true );
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
	);
};
export default NumberOutput;
