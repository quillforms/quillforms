/**
 * QuillForms Dependencies
 */
import { useTheme, useMessages } from '@quillforms/renderer-core';

/**
 * WordPress Dependencies
 */
import { useState, useEffect, useRef, useCallback } from '@wordpress/element';

/**
 * External Dependencies
 */
import MaskedInput from 'react-text-mask';
import dayJs from 'dayjs';
import { css } from 'emotion';
import classnames from 'classnames';
import VisibilitySensor from 'react-visibility-sensor';

/**
 * Internal Dependencies
 */
import createAutoCorrectedDatePipe from './create-autocorrected-date-pipe';

const DateOutput = ( props ) => {
	const {
		id,
		isAnimating,
		attributes,
		setIsValid,
		setIsAnswered,
		isFocused,
		isActive,
		setValidationErr,
		showSubmitBtn,
		showErrMsg,
		val,
		setVal,
	} = props;
	const { format, separator, required } = attributes;
	const [ simulateFocusStyle, setSimulateFocusStyle ] = useState( true );
	const [ isVisible, setIsVisible ] = useState( false );
	const messages = useMessages();
	const theme = useTheme();
	const elemRef = useRef();

	const checkFieldValidation = ( value ) => {
		const date = dayJs( value );
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
		checkFieldValidation( val );
	}, [ required ] );

	useEffect( () => {
		if ( isActive ) {
			// if ( isFocused && isAnimating ) {
			// 	debugger;
			// 	setSimulateFocusStyle( true );
			// 	return;
			// }
			if ( ! isAnimating && isFocused && isVisible ) {
				elemRef.current.inputElement.focus();
				setSimulateFocusStyle( false );
			}
		} else {
			setSimulateFocusStyle( true );
		}
	}, [ isAnimating, isActive, isFocused, isVisible ] );

	const changeHandler = ( e ) => {
		const value = e.target.value;
		console.log( value );

		setVal( value );
		showErrMsg( false );
		checkFieldValidation( value );

		if ( value !== '' ) {
			setIsAnswered( true );
			showSubmitBtn( true );
		} else {
			setIsAnswered( false );
			showSubmitBtn( false );
		}
	};

	const getPlaceholder =  () => {
		if ( format === 'MMDDYYYY' ) {
			return 'MM' + separator + 'DD' + separator + 'YYYY';
		} else if ( format === 'DDMMYYYY' ) {
			return 'DD' + separator + 'MM' + separator + 'YYYY';
		} else if ( format === 'YYYYMMDD' ) {
			return 'YYYY' + separator + 'MM' + separator + 'DD';
		}
	};

	const autoCorrectedDatePipe = createAutoCorrectedDatePipe(
		getPlaceholder().toLowerCase()
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
		<div>
			<VisibilitySensor
				resizeCheck={ true }
				resizeThrottle={ 100 }
				scrollThrottle={ 100 }
				onChange={ ( visible ) => {
					setIsVisible( visible );
				} }
			>
				<MaskedInput
					id={ `date-input-${ id }` }
					onChange={ changeHandler }
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
					placeholder={ getPlaceholder() }
					mask={ getMask() }
					pipe={ autoCorrectedDatePipe }
					value={ val && val.length > 0 ? val : '' }
				/>
			</VisibilitySensor>
		</div>
	);
};
export default DateOutput;
