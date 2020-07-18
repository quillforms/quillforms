/* eslint-disable no-nested-ternary */
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
import { QuestionHeader, QuestionBody } from '@quillforms/renderer-components';
import DropdownIcon from './dropdownIcon';
import CloseIcon from './closeIcon';

const DropdownOutput = ( props ) => {
	const {
		id,
		isAnimating,
		attributes,
		required,
		setIsValid,
		setIsAnswered,
		isReviewing,
		isActive,
		isFocused,
		next,
		val,
		setVal,
	} = props;
	const [ errMsg, setErrMsg ] = useState( null );
	const [ showErr, setShowErr ] = useState( false );
	let { choices } = attributes;
	const [ simulateFocusStyle, setSimulateFocusStyle ] = useState( true );
	const [ showDropdown, setShowDropdown ] = useState( false );
	const [ isVisible, setIsVisible ] = useState( false );
	const [ searchKeyword, setSearchKeyword ] = useState( '' );
	const elemRef = useRef();
	const wrapperRef = useRef();

	choices = choices
		.map( ( choice, index ) => {
			if ( ! choice.label ) choice.label = 'Choice ' + ( index + 1 );
			return choice;
		} )
		.filter( ( choice ) =>
			choice.label.toLowerCase().includes( searchKeyword.toLowerCase() )
		);

	let selectedChoiceIndex = -1;
	if ( val && val.length > 0 )
		selectedChoiceIndex = choices.findIndex(
			( choice ) => choice.ref === val.ref
		);
	const checkfieldValidation = () => {
		if ( required === true && ( ! val || val === '' ) ) {
			setIsValid( false );
			setErrMsg( 'Please fill this in!' );
		} else {
			setIsValid( true );
			setErrMsg( null );
		}
	};

	// Handle click outside the countries dropdown
	const handleClickOutside = ( e ) => {
		if ( wrapperRef.current && ! wrapperRef.current.contains( e.target ) ) {
			setShowDropdown( false );
		}
	};

	// Attaching the previous event with UseEffect hook
	useEffect( () => {
		if ( showDropdown )
			// Bind the event listener
			document.addEventListener( 'mousedown', handleClickOutside );
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener( 'mousedown', handleClickOutside );
		};
	}, [ showDropdown ] );

	useEffect( () => {
		setShowErr( false );
		checkfieldValidation( val );
	}, [ isReviewing, required, attributes ] );

	useEffect( () => {
		if ( isActive ) {
			setSearchKeyword( '' );
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
			setShowDropdown( false );
			setSimulateFocusStyle( true );
		}
	}, [ isActive, isFocused, isAnimating, isVisible ] );

	const changeHandler = ( e ) => {
		setSearchKeyword( e.target.value );

		if ( val ) {
			setIsAnswered( false );
			setSearchKeyword( '' );
			setVal( null );
		}
	};

	return (
		<div
			role="presentation"
			tabIndex="0"
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
				<div className="question__wrapper" ref={ wrapperRef }>
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
							autoComplete="off"
							ref={ elemRef }
							className={
								'question__InputField' +
								( simulateFocusStyle ? ' no-border' : '' )
							}
							id={ 'dropdown-' + id }
							placeholder="Type or select an option"
							onChange={ changeHandler }
							value={
								selectedChoiceIndex !== -1
									? choices[ selectedChoiceIndex ].label
									: searchKeyword
									? searchKeyword
									: ''
							}
							onClick={ () => setShowDropdown( true ) }
						/>
					</VisibilitySensor>
					{ val && val.length > 0 ? (
						<CloseIcon
							onClick={ () => {
								setVal( [] );
								elemRef.current.focus();
							} }
						/>
					) : (
						<DropdownIcon
							onClick={ () => setShowDropdown( true ) }
						/>
					) }
					{ isActive && (
						<div
							className={
								'dropdown__choices' +
								( showDropdown ? ' visible' : ' hidden' )
							}
							onWheel={ ( e ) => {
								if ( showDropdown ) e.stopPropagation();
							} }
						>
							{ choices && choices.length > 0 ? (
								choices.map( ( choice ) => {
									return (
										<div
											role="presentation"
											key={ choice.ref }
											className={
												'dropdown__choiceWrapper' +
												( !! val &&
												val.ref === choice.ref
													? ' selected'
													: '' )
											}
											onClick={ () => {
												setVal( {
													ref: choice.ref,
													label: choice.label,
												} );
												setTimeout( () => {
													next();
												}, 700 );
											} }
										>
											{ choice.label }
										</div>
									);
								} )
							) : (
								<div className="sf-err-msg">
									No suggestions found
								</div>
							) }
						</div>
					) }
				</div>

				<div style={ { height: '60px', marginTop: '20px' } }>
					{ errMsg && ( showErr || isReviewing ) && (
						<div className="sf-err-msg">{ errMsg }</div>
					) }
				</div>
			</QuestionBody>
		</div>
	);
};
export default DropdownOutput;
