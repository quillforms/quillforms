/* eslint-disable no-nested-ternary */
/**
 * QuillForms Dependencies
 */
import { useTheme, useMessages } from '@quillforms/renderer-core';

/**
 * WordPress Dependencies
 */
import { useState, useEffect, useRef } from '@wordpress/element';
import { use, useSelect } from '@wordpress/data';

/**
 * External Dependencies
 */
import tinyColor from 'tinycolor2';
import { css } from 'emotion';
import classnames from 'classnames';
import { cloneDeep, some } from 'lodash';

/**
 * Internal Dependencies
 */
import DropdownIcon from './expand-icon';
import CloseIcon from './close-icon';
import ChoiceItem from './choice-item';

const ENTER_CODE = 13;
const ESC_CODE = 27;
const ARROW_UP_CODE = 38;
const ARROW_DOWN_CODE = 40;

let timer;
const DropdownDisplay = ( props ) => {
	const {
		id,
		attributes,
		setIsValid,
		setIsAnswered,
		setValidationErr,
		val,
		setVal,
		next,
		showErrMsg,
		isActive,
		isTouchScreen,
		setFooterDisplay,
		inputRef,
		isPreview,
	} = props;
	const { choices, required } = attributes;
	const [ showDropdown, setShowDropdown ] = useState( false );
	const [searchKeyword, setSearchKeyword] = useState('');
	const [selectedChoiceIndex, setSelectedChoiceIndex] = useState(-1);
	const [clicked, setClicked] = useState(false);
	const [showCloseIcon, setShowCloseIcon] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const [showFixedDropdown, setShowFixedDropdown] = useState(false);
	const wrapperRef = useRef();
	const choicesWrappeerRef = useRef();
	const messages = useMessages();
	const theme = useTheme();
	const answersColor = tinyColor( theme.answersColor );
	const $choices = cloneDeep( choices )
		.map( ( choice, index ) => {
			if (!choice.label) choice.label = 'Choice ' + (index + 1);
			return choice;
		} )
		.filter( ( choice ) =>
			choice.label.toLowerCase().includes( searchKeyword.toLowerCase() )
		);

	const checkFieldValidation = () => {
		if ( required === true && ( ! val || val === '' ) ) {
			setIsValid( false );
			setValidationErr(
				messages[ 'label.errorAlert.selectionRequired' ]
			);
		} else {
			setIsValid( true );
			setValidationErr( null );
		}
	};

	const { isReviewing } = useSelect( ( select ) => {
		return {
			isReviewing: select( 'quillForms/renderer-core' ).isReviewing(),
		};
	} );

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
		// if change in attributes and is in preview mode, check validation
		// Note, that this effect will also be called on mount, that's why we check if isReviewing = false
		// because we want to display errors coming from server.
		if ( isPreview || ! isReviewing ) checkFieldValidation( val );
	}, [ val, attributes ] );

	const changeHandler = (e) => {
		// show close icon of there is any string
		setShowCloseIcon(e.target.value !== '');
		setInputValue(e.target.value);
		setShowDropdown( true );
		if ( val ) {
			setVal( null );
			setSearchKeyword( '' );
			return;
		}
		setSearchKeyword( e.target.value );
	};

	useEffect( () => {
		if ( ! isActive ) {
			clearTimeout( timer );
		}
	}, [ isActive ] );

	useEffect( () => {
		if ( val ) {
			const selectedChoice = $choices.find(
				( choice ) => choice.value === val
			);
			setSearchKeyword( selectedChoice ? selectedChoice.label : '' );
		}
		return () => clearTimeout( timer );
	}, []);

	const handleChoiceKeyDown = (e) => {
		if (isTouchScreen) return;
		if (e.keyCode === ESC_CODE) {
			setShowDropdown(false);
			setShowCloseIcon(inputValue !== '');
			setSelectedChoiceIndex(-1);
		}

		if (e.keyCode === ARROW_UP_CODE) {
			if (selectedChoiceIndex <= 0) {
				return;
			}
			setSelectedChoiceIndex(selectedChoiceIndex - 1);
			return;
		}

		if (e.keyCode === ARROW_DOWN_CODE) {
			if (selectedChoiceIndex === $choices.length - 1) {
				return
			}
			!showDropdown && setShowDropdown(true);
			setSelectedChoiceIndex(selectedChoiceIndex + 1);
			return;
		}

		if (e.keyCode === ENTER_CODE) {
			if (selectedChoiceIndex === -1) {
				setShowDropdown(false);
				return;
			}
			setClicked(true);
			return;
		}	
	} 
	
	const clickHandler = (choice = $choices[selectedChoiceIndex]) => {
		const selectedIndex = $choices.findIndex(c => c.value === choice.value);
		if (selectedIndex !== selectedChoiceIndex) setSelectedChoiceIndex(selectedIndex);
		setClicked(false);
		setShowCloseIcon(false);
		showErrMsg(false);
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
	}

	return (
		<div ref={ wrapperRef } style={ { position: 'relative' } }>
			<input
				ref={ inputRef }
				className={ classnames(
					css`
						& {
							width: 100%;
							border: none;
							outline: none;
							font-size: 30px;
							padding-bottom: 8px;
							background: transparent;
							transition: box-shadow 0.1s ease-out 0s;
							box-shadow: ${ answersColor
									.setAlpha( 0.3 )
									.toString() }
								0px 1px;
							@media ( max-width: 600px ) {
								font-size: 24px;
							}

							@media ( max-width: 480px ) {
								font-size: 20px;
							}
						}

						&::placeholder {
							opacity: 0.3;
							/* Chrome, Firefox, Opera, Safari 10.1+ */
							color: ${ theme.answersColor };
						}

						&:-ms-input-placeholder {
							opacity: 0.3;
							/* Internet Explorer 10-11 */
							color: ${ theme.answersColor };
						}

						&::-ms-input-placeholder {
							opacity: 0.3;
							/* Microsoft Edge */
							color: ${ theme.answersColor };
						}

						&:focus {
							box-shadow: ${ answersColor
									.setAlpha( 1 )
									.toString() }
								0px 2px;
						}

						color: ${ theme.answersColor };
					`
				) }
				id={ 'dropdown-' + id }
				placeholder={ messages[ 'block.dropdown.placeholder' ] }
				onChange={ changeHandler }
				value={ searchKeyword }
				onClick={() => {
					if (isTouchScreen) setShowFixedDropdown(true);
					setShowDropdown(true);
				} }
				onFocus={ () => {
					if ( isTouchScreen ) {
						setFooterDisplay( false );
					}
				} }
				onBlur={ () => {
					if ( isTouchScreen ) {
						setFooterDisplay( true );
					}
				}}
				onKeyDown={handleChoiceKeyDown}
				autoComplete="off"
			/>
			{ (val && val.length > 0) || showCloseIcon ? (
				<CloseIcon
					onClick={ () => {
						clearTimeout(timer);
						setSearchKeyword( '' );
						setIsAnswered( false );
						setVal(undefined);
						setShowCloseIcon(false);
						if ( ! isTouchScreen ) {
							inputRef.current.focus();
						}
					}}
				/>
			) : (
					<DropdownIcon style={{ transform: `${showDropdown ? 'rotate(180deg)' : 'rotate(0deg)'}` }} onClick={() => { setShowDropdown(!showDropdown); inputRef.current.focus() }} onKeyDown={(e) => {
						if (e.keyCode === ENTER_CODE) {
							setShowDropdown(!showDropdown)
						} else {
							return;
						}
					}} />
			) }
			{ showDropdown && (
				<div
					className={
						'qf-block-dropdown-display__choices' +
						(showDropdown ? ' visible ' : ' hidden ') +
						classnames(
							css`
							${showFixedDropdown ? `
							    position: fixed;
								inset: 0;
								background-color: #fff;
			                    height: 100% !important;
								` : ``}
									
							`
						)
					}
					ref={ choicesWrappeerRef }
					onWheel={ ( e ) => {
						if ( showDropdown ) {
							e.stopPropagation();
						}
					}}
				>
					{
						showFixedDropdown && <svg className="css-who0lh" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path></svg>
					}
					{ $choices?.length > 0 ? (
						$choices.map( ( choice, index ) => {
							return (
								<ChoiceItem
									hovered={index === selectedChoiceIndex}
									clicked={index === selectedChoiceIndex && clicked}
									role="presentation"
									key={ `block-dropdown-${ id }-choice-${ choice.value }` }
									clickHandler={() => clickHandler(choice)}
									choice={ choice }
									val={ val }
									showDropdown={ showDropdown }
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
							{ messages[ 'block.dropdown.noSuggestions' ] }
						</div>
					) }
				</div>
			) }
		</div>
	);
};
export default DropdownDisplay;
