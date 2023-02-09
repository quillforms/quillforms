/**
 * QuillForms Dependencies
 */
import { useMessages, useBlockTheme } from '@quillforms/renderer-core';

/**
 * WordPress Dependencies
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelect } from '@wordpress/data';

/**
 * External Dependencies
 */
import tinyColor from 'tinycolor2';
import MaskedInput from 'react-text-mask';
import dayJs from 'dayjs';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';
import { css } from 'emotion';
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import createAutoCorrectedDatePipe from './create-autocorrected-date-pipe';

const DateOutput = ( props ) => {
	const {
		id,
		attributes,
		setIsValid,
		isPreview,
		setIsAnswered,
		setValidationErr,
		showNextBtn,
		showErrMsg,
		val,
		setVal,
		setFooterDisplay,
		isTouchScreen,
		inputRef,
		isReviewing,
	} = props;
	const { format, separator, required } = attributes;
	const theme = useBlockTheme( attributes.themeId );

	const messages = useMessages();
	const answersColor = tinyColor( theme.answersColor );

	const getPlaceholder = () => {
		if ( format === 'MMDDYYYY' ) {
			return 'MM' + separator + 'DD' + separator + 'YYYY';
		} else if ( format === 'DDMMYYYY' ) {
			return 'DD' + separator + 'MM' + separator + 'YYYY';
		} else if ( format === 'YYYYMMDD' ) {
			return 'YYYY' + separator + 'MM' + separator + 'DD';
		}
	};

	const checkFieldValidation = ( value ) => {
		dayJs.extend( CustomParseFormat );
		const date = dayJs( value, getPlaceholder(), true );
		if ( required === true && ( ! value || value === '' ) ) {
			setIsValid( false );
			setValidationErr( messages[ 'label.errorAlert.required' ] );
		} else if ( ! date.isValid() && value ) {
			setIsValid( false );
			setValidationErr( messages[ 'label.errorAlert.date' ] );
		} else {
			setIsValid( true );
			setValidationErr( null );
		}
	};

	useEffect( () => {
		// if change in required flag and is in preview mode, check validation
		// Note, that this effect will also be called on mount, that's why we check if isReviewing = false
		// because we want to display errors coming from server.
		if ( isPreview || ! isReviewing ) checkFieldValidation( val );
	}, [ attributes ] );

	const changeHandler = ( e ) => {
		const value = e.target.value;
		setVal( value );
		showErrMsg( false );
		checkFieldValidation( value );

		if ( value !== '' ) {
			setIsAnswered( true );
			showNextBtn( true );
		} else {
			setIsAnswered( false );
		}
	};

	const autoCorrectedDatePipe = createAutoCorrectedDatePipe(
		getPlaceholder()?.toLowerCase()
	);

	const getMask = () => {
		if ( format === 'YYYYMMDD' ) {
			return [
				/\d/,
				/\d/,
				/\d/,
				/\d/,
				separator,
				/\d/,
				/\d/,
				separator,
				/\d/,
				/\d/,
			];
		}
		return [
			/\d/,
			/\d/,
			separator,
			/\d/,
			/\d/,
			separator,
			/\d/,
			/\d/,
			/\d/,
			/\d/,
		];
	};

	return (
		<MaskedInput
			onChange={ changeHandler }
			ref={ inputRef }
			className={ classnames(
				css`
					& {
						width: 100%;
						border: none;
						outline: none;
						border: none !important;
						border-radius: 0 !important;
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
			placeholder={ getPlaceholder() }
			mask={ getMask() }
			pipe={ autoCorrectedDatePipe }
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
export default DateOutput;
