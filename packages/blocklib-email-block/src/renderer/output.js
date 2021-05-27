/**
 * QuillForms Dependencies
 */
import { useTheme, useMessages } from '@quillforms/renderer-core';

/**
 * WordPress Dependencies
 */
import { useState, useEffect } from '@wordpress/element';

/**
 * External Dependencies
 */
import tinyColor from 'tinycolor2';
import { css } from 'emotion';
import classnames from 'classnames';

const EmailOutput = ( props ) => {
	const {
		id,
		attributes,
		isValid,
		setIsValid,
		setIsAnswered,
		setValidationErr,
		showSubmitBtn,
		val,
		setVal,
		showErrMsg,
		next,
		inputRef,
	} = props;
	const messages = useMessages();
	const theme = useTheme();
	const answersColor = tinyColor( theme.answersColor );
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
		<input
			ref={ inputRef }
			className={ classnames(
				css`
					& {
						margin-top: 15px;
						width: 100%;
						border: none;
						outline: none;
						font-size: 30px;
						padding-bottom: 8px;
						background: transparent;
						transition: box-shadow 0.1s ease-out 0s;
						box-shadow: ${ answersColor.setAlpha( 0.3 ).toString() }
							0px 1px;
						@media ( max-width: 600px ) {
							font-size: 24px;
						}
					}

					&::placeholder {
						opacity: 0.3;
						/* Chrome, Firefox, Opera, Safari 10.1+ */
						color: ${ theme.answersColor };
					}

					&:-ms-input-placeholder {
						opacity: 0.3;
						/* Internet Explorer 10-11 */
						color: ${ theme.answersColor };
					}

					&::-ms-input-placeholder {
						opacity: 0.3;
						/* Microsoft Edge */
						color: ${ theme.answersColor };
					}

					&:focus {
						box-shadow: ${ answersColor.setAlpha( 1 ).toString() }
							0px 2px;
					}

					color: ${ theme.answersColor };
				`
			) }
			id={ 'email-' + id }
			placeholder="Type your email here..."
			onChange={ changeHandler }
			value={ val && val.length > 0 ? val : '' }
		/>
	);
};
export default EmailOutput;
