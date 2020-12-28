/* eslint-disable no-nested-ternary */
/**
 * QuillForms Dependencies
 */
import { useMetaField } from '@quillforms/renderer-components';
import { useTheme } from '@quillforms/utils';

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
import tinyColor from 'tinycolor2';
/**
 * Internal Dependencies
 */
import DropdownIcon from './dropdownIcon';
import CloseIcon from './closeIcon';

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
	let { choices } = attributes;
	const [ simulateFocusStyle, setSimulateFocusStyle ] = useState( true );
	const [ showDropdown, setShowDropdown ] = useState( false );
	const [ isVisible, setIsVisible ] = useState( false );
	const [ searchKeyword, setSearchKeyword ] = useState( '' );
	const elemRef = useRef();
	const wrapperRef = useRef();
	const messages = useMetaField( 'messages' );
	const theme = useTheme();
	const answersColor = tinyColor( theme.answersColor );
	choices = choices
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
		if ( val?.ref ) {
			setVal( null );
			setSearchKeyword( '' );
			return;
		}
		setSearchKeyword( e.target.value );
	};

	useEffect( () => {
		if ( val?.ref ) setSearchKeyword( val.label );
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
					// // console.log(isVisible);
					setIsVisible( visible );
				} }
			>
				<input
					autoComplete="off"
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
					id={ 'dropdown-' + id }
					placeholder="Type or select an option"
					onFocus={ () => setShowDropdown( true ) }
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
					onWheel={ ( e ) => {
						if ( showDropdown ) e.stopPropagation();
					} }
				>
					{ choices && choices.length > 0 ? (
						choices.map( ( choice ) => {
							return (
								<div
									role="presentation"
									key={ `block-dropdown-${ id }-choice-${ choice.ref }` }
									className={ classnames(
										'dropdown__choiceWrapper',
										{
											selected:
												!! val &&
												val.ref === choice.ref,
										},
										css`
											background: ${answersColor
												.setAlpha( 0.1 )
												.toString()};

											border-color: ${theme.answersColor};
											color: ${theme.answersColor};

											&:hover {
												background: ${answersColor
													.setAlpha( 0.2 )
													.toString()};
											}

											&.selected {
												background: ${tinyColor(
													theme.answersColor
												)
													.setAlpha( 0.75 )
													.toString()};
												color: ${tinyColor(
													theme.answersColor
												).isDark()
													? '#fff'
													: tinyColor(
															theme.answersColor
													  )
															.darken( 20 )
															.toString()};
											}
										`
									) }
									onClick={ () => {
										clearTimeout( timer );
										if (
											val?.ref &&
											val.ref === choice.ref
										) {
											setVal( null );
											setIsAnswered( false );
											setSearchKeyword( '' );
											return;
										}
										setIsAnswered( true );
										setVal( {
											ref: choice.ref,
											label: choice.label,
										} );
										timer = setTimeout( () => {
											setSearchKeyword( choice.label );
											next();
										}, 700 );
									} }
								>
									{ choice.label }
								</div>
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
