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

const ShortTextOutput = ( props ) => {
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
	const [ simulateFocusStyle, setSimulateFocusStyle ] = useState( true );
	const [ isVisible, setIsVisible ] = useState( false );
	const messages = useMetaField( 'messages' );
	const theme = useTheme();

	const { maxCharacters, setMaxCharacters } = attributes;
	const elemRef = useRef( null );

	const checkfieldValidation = ( value ) => {
		if ( required === true && ( ! value || value === '' ) ) {
			setIsValid( false );
			setValidationErr( messages[ 'label.errorAlert.required' ] );
		} else if (
			setMaxCharacters &&
			maxCharacters > 0 &&
			value.length > maxCharacters
		) {
			setIsValid( false );
			setValidationErr( messages[ 'label.errorAlert.maxCharacters' ] );
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
			elemRef.current.blur();
			setSimulateFocusStyle( true );
		}
	}, [ isActive, isFocused, isAnimating, isVisible ] );

	useEffect( () => {
		checkfieldValidation( val );
	}, [ attributes ] );

	const changeHandler = ( e ) => {
		const value = e.target.value;
		if (
			setMaxCharacters &&
			maxCharacters > 0 &&
			value.length > maxCharacters
		) {
			shakeWithError( messages[ 'label.errorAlert.maxCharacters' ] );
		} else {
			setVal( value );
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
					id={ 'short-text-' + id }
					placeholder="Type your answer here..."
					onChange={ changeHandler }
					value={ val && val.length > 0 ? val : '' }
				/>
			</VisibilitySensor>
		</div>
	);
};
export default ShortTextOutput;
