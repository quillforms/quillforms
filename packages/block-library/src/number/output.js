/**
 * QuillForms Depndencies
 */
import { useMetaField, useTheme } from '@quillforms/renderer-components';

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

const NumberOutput = ( props ) => {
	const {
		id,
		attributes,
		isAnimating,
		required,
		setIsValid,
		setIsAnswered,
		isFocused,
		isActive,
		setValidationErr,
		showSubmitBtn,
		shakeWithError,
		val,
		setVal,
	} = props;
	const { setMax, max, setMin, min } = attributes;
	const [ simulateFocusStyle, setSimulateFocusStyle ] = useState( true );
	const [ isVisible, setIsVisible ] = useState( false );

	const messages = useMetaField( 'messages' );
	const theme = useTheme();

	const elemRef = useRef();

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
		checkfieldValidation( val, false );
	}, [ attributes ] );

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

	const changeHandler = ( e ) => {
		const value = e.target.value;
		if ( isNaN( value ) ) {
			shakeWithError( 'Numbers only!' );
			return;
		}
		setVal( parseInt( value ) );
		checkfieldValidation( parseInt( value ) );

		if ( value ) {
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
					ref={ elemRef }
					id={ 'number-' + id }
					onBlur={ () => {
						checkfieldValidation( val );
					} }
					placeholder="Type your answer here..."
					onChange={ changeHandler }
					value={ val ? val : '' }
				/>
			</VisibilitySensor>
		</div>
	);
};
export default NumberOutput;
