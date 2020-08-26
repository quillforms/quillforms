/**
 * WordPress Dependencies
 */
import { useState, useEffect, useRef } from '@wordpress/element';

/**
 * External Dependencies
 */
import VisibilitySensor from 'react-visibility-sensor';

const WebsiteOutput = ( props ) => {
	const {
		attributes,
		id,
		isAnimating,
		required,
		setIsValid,
		isReviewing,
		setIsAnswered,
		isFocused,
		isActive,
		val,
		setVal,
		setShowErr,
		setErrMsgKey,
	} = props;
	const [ simulateFocusStyle, setSimulateFocusStyle ] = useState( true );
	const [ isVisible, setIsVisible ] = useState( false );
	const elemRef = useRef();

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
			setErrMsgKey( 'label.errorAlert.required' );
		} else if ( ! validateUrl( value ) && value !== '' ) {
			setIsValid( false );
			setErrMsgKey( "hmmm.. That doesn't look a valid url!" );
		} else {
			setIsValid( true );
			setErrMsgKey( null );
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
		setShowErr( false );
		checkfieldValidation( val, false );
	}, [ isReviewing, attributes ] );

	const changeHandler = ( e ) => {
		const value = e.target.value;
		setErrMsgKey( null );
		checkfieldValidation( value );
		setVal( value );
		if ( value !== '' ) {
			setIsAnswered( true );
		} else {
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
					type="text"
					ref={ elemRef }
					className={
						'question__InputField' +
						( simulateFocusStyle ? ' no-border' : '' )
					}
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
