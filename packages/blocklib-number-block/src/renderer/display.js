/**
 * QuillForms Depndencies
 */
import { useMessages, useBlockTheme } from '@quillforms/renderer-core';

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

const NumberOutput = ( props ) => {
	const {
		id,
		attributes,
		setIsValid,
		setIsAnswered,
		setValidationErr,
		showNextBtn,
		blockWithError,
		val,
		setVal,
		showErrMsg,
		inputRef,
		isTouchScreen,
		setFooterDisplay,
	} = props;
	const { setMax, max, setMin, min, required } = attributes;
	const messages = useMessages();
	const theme = useBlockTheme( attributes.themeId );
	const answersColor = tinyColor( theme.answersColor );

	const checkfieldValidation = ( value ) => {
		if ( required === true && ( ! value || value === '' ) ) {
			setIsValid( false );
			setValidationErr( messages[ 'label.errorAlert.required' ] );
		} else if ( setMax && max > 0 && value > max ) {
			setIsValid( false );
			setValidationErr( messages[ 'label.errorAlert.maxNum' ] );
		} else if ( setMin && min >= 0 && value < min ) {
			setIsValid( false );
			setValidationErr( messages[ 'label.errorAlert.minNum' ] );
		} else {
			setIsValid( true );
			setValidationErr( null );
		}
	};

	useEffect( () => {
		checkfieldValidation( val );
	}, [ attributes ] );

	const changeHandler = ( e ) => {
		const value = e.target.value;
		if ( isNaN( value ) ) {
			blockWithError( 'Numbers only!' );
			return;
		}
		setVal( parseInt( value ) );
		showErrMsg( false );
		checkfieldValidation( parseInt( value ) );

		if ( value ) {
			setIsAnswered( true );
			showNextBtn( true );
		} else {
			setIsAnswered( false );
			showNextBtn( false );
		}
	};

	let specialProps = {};
	if ( isTouchScreen ) {
		specialProps = {
			type: 'number',
		};
	}
	return (
		<input
			{ ...specialProps }
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

						-moz-appearance: textfield;

						@media ( max-width: 600px ) {
							font-size: 24px;
						}

						@media ( max-width: 400px ) {
							font-size: 20px;
						}

						&::-webkit-outer-spin-button,
						&::-webkit-inner-spin-button {
							-webkit-appearance: none;
							margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
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

					color: ${ theme.answersColor };
				`
			) }
			id={ 'number-' + id }
			placeholder={ messages[ 'block.number.placeholder' ] }
			onChange={ changeHandler }
			value={ val ? val : '' }
			onFocus={ () => {
				if ( isTouchScreen ) {
					setFooterDisplay( false );
				}
			} }
			onWheel={ ( e ) => e.target.blur() }
			onBlur={ () => {
				if ( isTouchScreen ) {
					setFooterDisplay( true );
				}
			} }
			autoComplete="off"
		/>
	);
};
export default NumberOutput;
