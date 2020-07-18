/**
 * WordPress Dependencies
 */
import { useState, useEffect, useRef } from '@wordpress/element';

/**
 * External Dependencies
 */
import VisibilitySensor from 'react-visibility-sensor';

/**
 * Internal Dependencies
 */
import {
	FieldAction,
	QuestionBody,
	QuestionHeader,
} from '@quillforms/renderer-components';

const EmailOutput = ( props ) => {
	const {
		id,
		isAnimating,
		required,
		attributes,
		setIsValid,
		isReviewing,
		setIsAnswered,
		isFocused,
		isActive,
		next,
		val,
		setVal,
	} = props;
	const [ errMsg, setErrMsg ] = useState( null );
	const [ showErr, setShowErr ] = useState( false );
	const [ simulateFocusStyle, setSimulateFocusStyle ] = useState( true );
	const [ isVisible, setIsVisible ] = useState( false );

	const elemRef = useRef();

	const validateEmail = ( email ) => {
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test( String( email ).toLowerCase() );
	};

	const checkfieldValidation = ( value ) => {
		if ( required === true && ( ! value || value === '' ) ) {
			setIsValid( false );
			setErrMsg( 'Please fill this in!' );
		} else if ( ! validateEmail( val ) && value !== '' ) {
			setIsValid( false );
			setErrMsg( "hmmm.. That doesn't look a valid email!" );
		} else {
			setIsValid( true );
			setErrMsg( null );
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
		setErrMsg( null );
		setVal( value );
		if ( value !== '' ) {
			setIsAnswered( true );
		} else {
			setIsAnswered( false );
		}
	};

	return (
		<div
			role="button"
			tabIndex="-1"
			style={ { outline: 'none' } }
			onKeyDown={ ( e ) => {
				if ( e.key === 'Enter' && e.target.value !== '' ) {
					e.stopPropagation();
					checkfieldValidation( val );
					setShowErr( true );
					next();
				}
			} }
		>
			<QuestionHeader { ...props } />
			<QuestionBody>
				<div className="question__wrapper">
					<VisibilitySensor
						resizeCheck={ true }
						resizeThrottle={ 100 }
						scrollThrottle={ 100 }
						onChange={ ( visible ) => {
							// // console.log(isVisible);
							setIsVisible( visible );
						} }
					>
						<input
							ref={ elemRef }
							className={
								'question__InputField' +
								( simulateFocusStyle ? ' no-border' : '' )
							}
							id={ 'email-' + id }
							placeholder="Type your email here..."
							onChange={ changeHandler }
							value={ val && val.length > 0 ? val : '' }
						/>
					</VisibilitySensor>
				</div>

				<div style={ { height: '60px', marginTop: '20px' } }>
					{ errMsg && ( showErr || isReviewing ) ? (
						<div className="sf-err-msg">{ errMsg }</div>
					) : (
						<FieldAction
							show={ val && val !== '' }
							clickHandler={ () => {
								checkfieldValidation( val );
								setShowErr( true );
								next();
							} }
						/>
					) }
				</div>
			</QuestionBody>
		</div>
	);
};
export default EmailOutput;
