/* eslint-disable no-nested-ternary */
/**
 * QuillForms Dependencies
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
import { cloneDeep } from 'lodash';
/**
 * Internal Dependencies
 */
import DropdownIcon from './dropdownIcon';
import CloseIcon from './closeIcon';
import ChoiceItem from './choice-item';

let timer;
const DropdownOutput = ( props ) => {
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
		val,
		setVal,
		next,
	} = props;
	const { choices } = attributes;
	const [ simulateFocusStyle, setSimulateFocusStyle ] = useState( true );
	const [ showDropdown, setShowDropdown ] = useState( false );
	const [ isVisible, setIsVisible ] = useState( false );
	const [ searchKeyword, setSearchKeyword ] = useState( '' );
	const elemRef = useRef();
	const wrapperRef = useRef();
	const choicesWrappeerRef = useRef();
	const messages = useMessages();
	const theme = useTheme();
	const $choices = cloneDeep( choices )
		.map( ( choice, index ) => {
			if ( ! choice.label ) choice.label = 'Choice ' + ( index + 1 );
			return choice;
		} )
		.filter( ( choice ) =>
			choice.label.toLowerCase().includes( searchKeyword.toLowerCase() )
		);

	const checkfieldValidation = () => {
		if ( required === true && ( ! val || val === '' ) ) {
			setIsValid( false );
			setValidationErr( messages[ 'label.errorAlert.required' ] );
		} else {
			setIsValid( true );
			setValidationErr( null );
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
		checkfieldValidation( val );
	}, [ required, attributes ] );

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
			setShowDropdown( false );
			setSimulateFocusStyle( true );
		}
	}, [ isActive, isFocused, isAnimating, isVisible ] );

	const changeHandler = ( e ) => {
		if ( val ) {
			setVal( null );
			setSearchKeyword( '' );
			return;
		}
		setSearchKeyword( e.target.value );
	};

	useEffect( () => {
		if ( val ) {
			const selectedChoice = $choices.find(
				( choice ) => choice.value === val
			);
			setSearchKeyword( selectedChoice ? selectedChoice.label : '' );
		}
	}, [] );

	return (
		<div
			className="question__wrapper"
			ref={ wrapperRef }
			style={ { position: 'relative' } }
		>
			<VisibilitySensor
				resizeCheck={ true }
				resizeThrottle={ 100 }
				scrollThrottle={ 100 }
				onChange={ ( visible ) => {
					// // // console.log(isVisible);
					setIsVisible( visible );
				} }
			>
				<input
					autoComplete="off"
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
					id={ 'dropdown-' + id }
					placeholder="Type or select an option"
					onChange={ changeHandler }
					value={ searchKeyword }
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
				<DropdownIcon onClick={ () => setShowDropdown( true ) } />
			) }
			{ isActive && (
				<div
					className={
						'dropdown__choices' +
						( showDropdown ? ' visible' : ' hidden' )
					}
					ref={ choicesWrappeerRef }
					onWheel={ ( e ) => {
						if ( showDropdown ) {
							e.stopPropagation();
						}
					} }
				>
					{ $choices?.length > 0 ? (
						$choices.map( ( choice ) => {
							return (
								<ChoiceItem
									role="presentation"
									key={ `block-dropdown-${ id }-choice-${ choice.value }` }
									clickHandler={ () => {
										clearTimeout( timer );
										if ( val && val === choice.value ) {
											setVal( null );
											setIsAnswered( false );
											setSearchKeyword( '' );
											return;
										}
										setIsAnswered( true );
										setVal( choice.value );
										timer = setTimeout( () => {
											setSearchKeyword( choice.label );
											next();
										}, 700 );
									} }
									choice={ choice }
									val={ val }
								/>
							);
						} )
					) : (
						<div className="sf-err-msg">No suggestions found</div>
					) }
				</div>
			) }
		</div>
	);
};
export default DropdownOutput;
