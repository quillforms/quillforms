/**
 * QuillForms Dependencies
 */
import { useMessages, useBlockTheme } from '@quillforms/renderer-core';

/**
 * WordPress Dependencies
 */
import { useEffect } from '@wordpress/element';

/**
 * External Dependencies
 */
import tinyColor from 'tinycolor2';
import { css } from 'emotion';
import classnames from 'classnames';
import * as EmailValidator from 'email-validator';

const EmailOutput = ( props ) => {
	const {
		id,
		attributes,
		setIsValid,
		setIsAnswered,
		setValidationErr,
		showNextBtn,
		val,
		setVal,
		showErrMsg,
		next,
		inputRef,
		isTouchScreen,
		setFooterDisplay,
	} = props;
	const theme = useBlockTheme( attributes.themeId );
	const messages = useMessages();
	const answersColor = tinyColor( theme.answersColor );
	const { required } = attributes;

	const checkFieldValidation = ( value ) => {
		if (
			required === true &&
			( ! value || value === '' || value.length === 0 )
		) {
			setIsValid( false );
			setValidationErr( messages[ 'label.errorAlert.required' ] );
		} else if (
			value &&
			! EmailValidator.validate( value ) &&
			value.length > 0
		) {
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
		if ( ! value ) {
			setIsAnswered( false );
			showNextBtn( false );
		} else {
			setIsAnswered( true );
			showNextBtn( true );
		}
	};

	return (
		<input
			ref={ inputRef }
			className={ classnames(
				css`
					& {
						width: 100%;
						border: none !important;
						outline: none;
						font-size: 30px;
						padding-bottom: 8px;
						border-radius: 0 !important;
						background: transparent;
						background-color: transparent !important;
						transition: box-shadow 0.1s ease-out 0s;
						box-shadow: ${ answersColor.setAlpha( 0.3 ).toString() }
							0px 1px !important;
						@media ( max-width: 600px ) {
							font-size: 24px;
						}
						@media ( max-width: 420px ) {
							font-size: 20px;
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
							0px 2px !important;
						border: none !important;
						outline: none !important;
					}

					color: ${ theme.answersColor } !important;
				`
			) }
			id={ 'email-' + id }
			type="email"
			placeholder={ messages[ 'block.email.placeholder' ] }
			onChange={ changeHandler }
			value={ val && val.length > 0 ? val : '' }
			onFocus={ () => {
				if ( isTouchScreen ) {
					setFooterDisplay( false );
				}
			} }
			onBlur={ () => {
				if ( isTouchScreen ) {
					setFooterDisplay( true );
				}
			} }
			autoComplete="off"
		/>
	);
};
export default EmailOutput;
