/**
 * QuillForms Dependencies
 */
import { useMetaField, useTheme } from '@quillforms/renderer-components';

/**
 * WordPress Dependencies
 */
import { useState, useEffect, useRef } from '@wordpress/element';

/**
 * External Dependencies
 */
import MaskedInput from 'react-text-mask';
import moment from 'moment';
import { createAutoCorrectedDatePipe } from 'text-mask-addons';
import { css } from 'emotion';
import classnames from 'classnames';
import VisibilitySensor from 'react-visibility-sensor';

const DateOutput = ( props ) => {
	const {
		id,
		isAnimating,
		required,
		attributes,
		setIsValid,
		setIsAnswered,
		isFocused,
		isActive,
		setValidationErr,
		showSubmitBtn,
		val,
		setVal,
	} = props;
	const { format, separator } = attributes;
	const [ simulateFocusStyle, setSimulateFocusStyle ] = useState( true );
	const [ isVisible, setIsVisible ] = useState( false );
	const messages = useMetaField( 'messages' );
	const theme = useTheme();
	const elemRef = useRef();

	const checkfieldValidation = ( value ) => {
		const date = moment( value );
		if ( required === true && ( ! value || value === '' ) ) {
			setIsValid( false );
			setValidationErr( messages[ 'label.errorAlert.required' ] );
		} else if ( ! date.isValid() ) {
			setIsValid( false );
			setValidationErr( messages[ 'label.errorAlert.date' ] );
		} else {
			setIsValid( true );
			setValidationErr( null );
		}
	};

	useEffect( () => {
		console.log( '4tm' );
		//checkfieldValidation( val );
	}, [ required, attributes ] );

	useEffect( () => {
		if ( isActive ) {
			if ( isFocused && isAnimating ) {
				setSimulateFocusStyle( true );
				return;
			}
			if ( ! isAnimating && isFocused && isVisible ) {
				elemRef.current.inputElement.focus();
				setSimulateFocusStyle( false );
			}
		} else {
			elemRef.current.inputElement.blur();
			setSimulateFocusStyle( true );
		}
	}, [ isAnimating, isActive, isFocused, isVisible ] );

	const changeHandler = ( e ) => {
		const value = e.target.value;
		checkfieldValidation( value );
		setVal( value );
		if ( value !== '' ) {
			setIsAnswered( true );
			showSubmitBtn( true );
		} else {
			setIsAnswered( false );
			showSubmitBtn( false );
		}
	};

	const getPlaceholder = () => {
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
		<div className="question__wrapper">
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
							color: ${theme.answersColor};

							&::placeholder {
								/* Chrome, Firefox, Opera, Safari 10.1+ */
								color: ${theme.answersColor};
							}

							&:-ms-input-placeholder {
								/* Internet Explorer 10-11 */
								color: ${theme.answersColor};
							}

							&::-ms-input-placeholder {
								/* Microsoft Edge */
								color: ${theme.answersColor};
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
