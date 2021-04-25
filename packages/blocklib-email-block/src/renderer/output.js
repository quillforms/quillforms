/**
 * QuillForms Dependencies
 */
import { useTheme, useMessages } from '@quillforms/renderer-core';

/**
 * WordPress Dependencies
 */
import { useState, useEffect, useRef } from '@wordpress/element';

/**
 * External Dependencies
 */
import VisibilitySensor from 'react-visibility-sensor';
import { css } from 'emotion';
import classnames from 'classnames';

const EmailOutput = ( props ) => {
	const {
		id,
		attributes,
		isAnimating,
		isValid,
		setIsValid,
		setIsAnswered,
		isFocused,
		isActive,
		setValidationErr,
		showSubmitBtn,
		val,
		setVal,
		showErrMsg,
		next,
	} = props;
	const [ simulateFocusStyle, setSimulateFocusStyle ] = useState( true );
	const [ isVisible, setIsVisible ] = useState( false );
	const messages = useMessages();
	const theme = useTheme();
	const elemRef = useRef();
	const { required } = attributes;

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
			// elemRef.current.blur();
			setSimulateFocusStyle( true );
		}
	}, [ isActive, isFocused, isAnimating, isVisible ] );

	useEffect( () => {
		checkFieldValidation( val );
	}, [ required ] );

	const changeHandler = ( e ) => {
		const value = e.target.value;
		checkFieldValidation( value );
		setVal( value );
		showErrMsg( false );
		if ( value !== '' ) {
			setIsAnswered( true );
			showSubmitBtn( true );
		} else {
			setIsAnswered( false );
			showSubmitBtn( false );
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
				<input
					ref={ elemRef }
					className={ classnames(
						'question__InputField',
						css`
							color: ${ theme.answersColor };

							&::placeholder {
								/* Chrome, Firefox, Opera, Safari 10.1+ */
								color: ${ theme.answersColor };
							}

							&:-ms-input-placeholder {
								/* Internet Explorer 10-11 */
								color: ${ theme.answersColor };
							}

							&::-ms-input-placeholder {
								/* Microsoft Edge */
								color: ${ theme.answersColor };
							}
						`,
						{
							'no-border': simulateFocusStyle,
						}
					) }
					id={ 'email-' + id }
					placeholder="Type your email here..."
					onChange={ changeHandler }
					value={ val && val.length > 0 ? val : '' }
				/>
			</VisibilitySensor>
		</div>
	);
};
export default EmailOutput;
