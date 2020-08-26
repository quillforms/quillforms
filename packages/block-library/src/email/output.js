/**
 * WordPress Dependencies
 */
import { useState, useEffect, useRef } from '@wordpress/element';

/**
 * External Dependencies
 */
import VisibilitySensor from 'react-visibility-sensor';

const EmailOutput = ( props ) => {
	const {
		id,
		isAnimating,
		required,
		attributes,
		setIsValid,
		isReviewing,
		setIsAnswered,
		isFocused,
		isActive,
		setErrMsgKey,
		setShowErr,
		val,
		setVal,
	} = props;
	const [ simulateFocusStyle, setSimulateFocusStyle ] = useState( true );
	const [ isVisible, setIsVisible ] = useState( false );

	const elemRef = useRef();

	const validateEmail = ( email ) => {
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test( String( email ).toLowerCase() );
	};

	const checkfieldValidation = ( value ) => {
		if ( required === true && ( ! value || value === '' ) ) {
			setIsValid( false );
			setErrMsgKey( 'label.errorAlert.required' );
		} else if ( ! validateEmail( val ) && value !== '' ) {
			setIsValid( false );
			setErrMsgKey( 'label.errorAlert.email' );
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

	const changeHandler = ( e ) => {
		const value = e.target.value;
		checkfieldValidation( value );
		setShowErr( false );
		setVal( value );
		if ( value !== '' ) {
			setIsAnswered( true );
		} else {
			setIsAnswered( false );
		}
	};

	return (
		<>
			<div className="question__wrapper">
				<VisibilitySensor
					resizeCheck={ true }
					resizeThrottle={ 100 }
					scrollThrottle={ 100 }
					onChange={ ( visible ) => {
						// // console.log(isVisible);
						setIsVisible( visible );
					} }
				>
					<input
						ref={ elemRef }
						className={
							'question__InputField' +
							( simulateFocusStyle ? ' no-border' : '' )
						}
						id={ 'email-' + id }
						placeholder="Type your email here..."
						onChange={ changeHandler }
						value={ val && val.length > 0 ? val : '' }
					/>
				</VisibilitySensor>
			</div>
		</>
	);
};
export default EmailOutput;
