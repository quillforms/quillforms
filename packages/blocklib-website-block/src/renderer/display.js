/**
 * QuillForms Depndencies
 */
import { useMessages, useBlockTheme } from '@quillforms/renderer-core';

/**
 * WordPress Dependencies
 */
import { useState, useEffect } from 'react';

/**
 * External Dependencies
 */
import tinyColor from 'tinycolor2';
import { css } from 'emotion';
import classnames from 'classnames';

const WebsiteOutput = ( props ) => {
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
		inputRef,
		isTouchScreen,
		setFooterDisplay,
		isPreview,
		isReviewing,
	} = props;
	const messages = useMessages();
	const theme = useBlockTheme( attributes.themeId );
	const answersColor = tinyColor( theme.answersColor );
	const { required, placeholder } = attributes;

	const validateUrl = ( url ) => {
		const pattern = new RegExp(
			'^(https?:\\/\\/)?' + // protocol
				'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
				'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
				'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
				'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
				'(\\#[-a-z\\d_]*)?$',
			'i'
		); // fragment locator
		return !! pattern.test( url );
	};

	const checkfieldValidation = ( value ) => {
		if ( required === true && ( ! value || value === '' ) ) {
			setIsValid( false );
			setValidationErr( messages[ 'label.errorAlert.required' ] );
		} else if ( ! validateUrl( value ) && value ) {
			setIsValid( false );
			setValidationErr( messages[ 'label.errorAlert.url' ] );
		} else {
			setIsValid( true );
			setValidationErr( null );
		}
	};

	useEffect( () => {
		if ( isPreview || ! isReviewing ) checkfieldValidation( val );
	}, [ attributes ] );

	const changeHandler = ( e ) => {
		const value = e.target.value;
		checkfieldValidation( value );
		setVal( value );
		showErrMsg( false );
		if ( value !== '' ) {
			showNextBtn( true );
			setIsAnswered( true );
		} else {
			setIsAnswered( false );
		}
	};

	return (
		<input
			ref={ inputRef }
			className={ classnames(
				css`
					& {
						width: 100%;
						border: none;
						outline: none;
						padding-bottom: 8px;
						background: transparent;
						transition: box-shadow 0.1s ease-out 0s;
						box-shadow: ${ answersColor.setAlpha( 0.3 ).toString() }
							0px 1px !important;
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
					}

					color: ${ theme.answersColor };
				`
			) }
			id={ 'website-' + id }
			placeholder={ placeholder === false ? 'https://' : placeholder }
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
export default WebsiteOutput;
