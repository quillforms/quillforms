/**
 * QuillForms Depndencies
 */
import { useTheme, useMessages } from '@quillforms/renderer-core';

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

const WebsiteOutput = ( props ) => {
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
		val,
		setVal,
	} = props;
	const [ simulateFocusStyle, setSimulateFocusStyle ] = useState( true );
	const [ isVisible, setIsVisible ] = useState( false );
	const elemRef = useRef();
	const messages = useMessages();
	const theme = useTheme();

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
		} else if ( ! validateUrl( value ) && value !== '' ) {
			setIsValid( false );
			setValidationErr( messages[ 'label.errorAlert.url' ] );
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

	const changeHandler = ( e ) => {
		const value = e.target.value;
		checkfieldValidation( value );
		setVal( value );
		if ( value !== '' ) {
			showSubmitBtn( true );
			setIsAnswered( true );
		} else {
			showSubmitBtn( false );
			setIsAnswered( false );
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
					id={ 'website-' + id }
					placeholder="https://"
					onChange={ changeHandler }
					value={ val && val.length > 0 ? val : '' }
					onBlur={ () => {
						checkfieldValidation( val );
					} }
				/>
			</VisibilitySensor>
		</div>
	);
};
export default WebsiteOutput;
