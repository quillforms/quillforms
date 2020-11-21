/**
 * QuillForms Dependencies
 */
import { useMetaField } from '@quillforms/renderer-components';

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
		setIsValid,
		isReviewing,
		setIsAnswered,
		isFocused,
		isActive,
		setValidationErr,
		showSubmitBtn,
		val,
		setVal,
	} = props;
	const [ simulateFocusStyle, setSimulateFocusStyle ] = useState( true );
	const [ isVisible, setIsVisible ] = useState( false );
	const messages = useMetaField( 'messages' );
	const elemRef = useRef();

	const validateEmail = ( email ) => {
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test( String( email ).toLowerCase() );
	};

	const checkFieldValidation = ( value ) => {
		if (
			required === true &&
			( ! value || value === '' || value.length === 0 )
		) {
			setIsValid( false );
			setValidationErr( messages[ 'label.errorAlert.required' ] );
		} else if ( ! validateEmail( val ) && value && value.length > 0 ) {
			setIsValid( false );
			setValidationErr( messages[ 'label.errorAlert.email' ] );
		} else {
			setIsValid( true );
			setValidationErr( null );
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
		checkFieldValidation( val );
	}, [ isReviewing, required ] );

	useEffect( () => {
		if ( val && val.length > 0 ) {
			showSubmitBtn( true );
		} else {
			showSubmitBtn( false );
		}
	}, [] );

	const changeHandler = ( e ) => {
		const value = e.target.value;
		checkFieldValidation( value );
		setVal( value );
		if ( value !== '' ) {
			setIsAnswered( true );
			showSubmitBtn( true );
		} else {
			setIsAnswered( false );
			showSubmitBtn( false );
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
