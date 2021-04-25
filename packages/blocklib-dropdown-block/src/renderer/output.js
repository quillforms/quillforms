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
import { cloneDeep, some } from 'lodash';

/**
 * Internal Dependencies
 */
import DropdownIcon from './expand-icon';
import CloseIcon from './close-icon';
import ChoiceItem from './choice-item';

let timer;
const DropdownOutput = ( props ) => {
	const {
		id,
		attributes,
		isAnimating,
		setIsValid,
		setIsAnswered,
		isFocused,
		isActive,
		setValidationErr,
		val,
		setVal,
		next,
		showErrMsg,
	} = props;
	const { choices, required } = attributes;
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
		if ( showDropdown ) {
			// Bind the event listener
			document.addEventListener( 'mousedown', handleClickOutside );
			console.log( 'lkfijewf' );
			if (
				document.querySelector(
					`#block-${ id } .renderer-core-field-footer`
				)
			) {
				document
					.querySelector(
						`#block-${ id } .renderer-core-field-footer`
					)
					.classList.add( 'is-hidden' );
			}
		} else {
			if (
				document.querySelector(
					`#block-${ id } .renderer-core-field-footer`
				)
			) {
				document
					.querySelector(
						`#block-${ id } .renderer-core-field-footer`
					)
					.classList.remove( 'is-hidden' );
			}
		}
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener( 'mousedown', handleClickOutside );
		};
	}, [ showDropdown ] );

	useEffect( () => {
		checkfieldValidation( val );
	}, [ val, attributes ] );

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
			setShowDropdown( false );
			setSimulateFocusStyle( true );
			if ( ! val ) setSearchKeyword( '' );
			else if ( ! some( choices, ( choice ) => choice.value === val ) ) {
				setVal( undefined );
				setSearchKeyword( '' );
			}
		}
	}, [ isActive, isFocused, isAnimating, isVisible ] );

	const changeHandler = ( e ) => {
		setShowDropdown( true );
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
		<div ref={ wrapperRef } style={ { position: 'relative' } }>
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
						setSearchKeyword( '' );
						setIsAnswered( false );
						setVal( undefined );
						elemRef.current.focus();
					} }
				/>
			) : (
				<DropdownIcon onClick={ () => setShowDropdown( true ) } />
			) }
			{ isActive && (
				<div
					className={
						'qf-block-dropdown-display__choices' +
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
										showErrMsg( false );
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
											setShowDropdown( false );
											next();
										}, 700 );
									} }
									choice={ choice }
									val={ val }
								/>
							);
						} )
					) : (
						<div
							className={ css`
								background: ${ theme.errorsBgColor };
								color: ${ theme.errorsFontColor };
								display: inline-block;
								padding: 5px 10px;
								border-radius: 5px;
							` }
						>
							No suggestions found
						</div>
					) }
				</div>
			) }
		</div>
	);
};
export default DropdownOutput;
