/**
 * QuillForms Depndencies
 */
import { useTheme, useMessages, HTMLParser } from '@quillforms/renderer-core';

/**
 * WordPress Dependencies
 */
import { useState, useEffect } from '@wordpress/element';

/**
 * External Dependencies
 */
import tinyColor from 'tinycolor2';
import TextareaAutosize from 'react-autosize-textarea';
import { css } from 'emotion';
import classnames from 'classnames';

const LongTextOutput = ( props ) => {
	const {
		id,
		attributes,
		setIsValid,
		setIsAnswered,
		setValidationErr,
		showSubmitBtn,
		blockWithError,
		val,
		setVal,
		showErrMsg,
		next,
		inputRef,
	} = props;
	const { setMaxCharacters, maxCharacters, required } = attributes;
	const messages = useMessages();
	const theme = useTheme();
	const answersColor = tinyColor( theme.answersColor );

	const checkfieldValidation = ( value ) => {
		if ( required === true && ( ! value || value === '' ) ) {
			setIsValid( false );
			setValidationErr( messages[ 'label.errorAlert.required' ] );
		} else if (
			setMaxCharacters &&
			maxCharacters > 0 &&
			value?.length > maxCharacters
		) {
			setIsValid( false );
			setValidationErr( messages[ 'label.errorAlert.maxCharacters' ] );
		} else {
			setIsValid( true );
			setValidationErr( null );
		}
	};

	useEffect( () => {
		checkfieldValidation( val );
	}, [ attributes ] );

	const keyDownHandler = ( e ) => {
		// Enter was pressed with shift key or not
		if ( e.keyCode === 13 ) {
			if ( e.shiftKey ) {
				// prevent default behavior
				e.stopPropagation();
			} else {
				e.preventDefault();
			}
		}
	};

	const changeHandler = ( e ) => {
		const value = e.target.value;
		if (
			setMaxCharacters &&
			maxCharacters > 0 &&
			value.length > maxCharacters
		) {
			blockWithError( messages[ 'label.errorAlert.maxCharacters' ] );
		} else {
			setVal( value );
			showErrMsg( false );
			checkfieldValidation( value );
		}
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
			<TextareaAutosize
				ref={ inputRef }
				onKeyDown={ keyDownHandler }
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
							box-shadow: ${ answersColor
									.setAlpha( 0.3 )
									.toString() }
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
							box-shadow: ${ answersColor
									.setAlpha( 1 )
									.toString() }
								0px 2px;
						}

						color: ${ theme.answersColor };
					`
				) }
				id={ 'longText-' + id }
				placeholder="Type your answer here..."
				onChange={ changeHandler }
				value={ val && val.length > 0 ? val : '' }
			/>
			<div className="question__instruction">
				<HTMLParser value={ messages[ 'block.longText.hint' ] } />
			</div>
		</>
	);
};
export default LongTextOutput;
