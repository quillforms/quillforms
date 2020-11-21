/**
 * QuillForms Depndencies
 */
import { useMetaField, HtmlParser } from '@quillforms/renderer-components';

/**
 * WordPress Dependencies
 */
import { useState, useEffect, useRef } from '@wordpress/element';

/**
 * External Dependencies
 */
import VisibilitySensor from 'react-visibility-sensor';
import TextareaAutosize from 'react-autosize-textarea';

const LongTextOutput = ( props ) => {
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
	const { setMaxCharacters, maxCharacters } = attributes;
	const messages = useMetaField( 'messages' );
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
		checkfieldValidation( val, false );
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
				<TextareaAutosize
					ref={ elemRef }
					onKeyDown={ keyDownHandler }
					className={
						'question__TextareaField' +
						( simulateFocusStyle ? ' no-border' : '' )
					}
					id={ 'longText-' + id }
					placeholder="Type your answer here..."
					onChange={ changeHandler }
					value={ val && val.length > 0 ? val : '' }
				/>
			</VisibilitySensor>
			<div className="question__instruction">
				<HtmlParser value={ messages[ 'block.longText.hint' ] } />
			</div>
		</div>
	);
};
export default LongTextOutput;
