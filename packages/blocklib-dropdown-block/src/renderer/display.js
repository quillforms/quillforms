/* eslint-disable no-nested-ternary */
/**
 * QuillForms Dependencies
 */
import { useTheme, useMessages } from '@quillforms/renderer-core';

/**
 * WordPress Dependencies
 */
import { useState, useEffect, useRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

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
		isTouchDevice,
		setFooterDisplay,
		inputRef,
		isPreview,
	} = props;
	const { choices, required } = attributes;
	const [ showDropdown, setShowDropdown ] = useState( false );
	const [ searchKeyword, setSearchKeyword ] = useState( '' );
	const wrapperRef = useRef();
	const choicesWrappeerRef = useRef();
	const messages = useMessages();
	const theme = useTheme();
	const answersColor = tinyColor( theme.answersColor );
	const $choices = cloneDeep( choices )
		.map( ( choice, index ) => {
			if ( ! choice.label ) choice.label = 'Choice ' + ( index + 1 );
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
			<input
				autoComplete="off"
				ref={ inputRef }
				className={ classnames(
					css`
						& {
							margin-top: 15px;
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
				onClick={ () => setShowDropdown( true ) }
				onFocus={ () => {
					if ( isTouchDevice ) {
						setFooterDisplay( false );
					}
				} }
				onBlur={ () => {
					if ( isTouchDevice ) {
						setFooterDisplay( true );
					}
				} }
			/>
			{ val && val.length > 0 ? (
				<CloseIcon
					onClick={ () => {
						setSearchKeyword( '' );
						setIsAnswered( false );
						setVal( undefined );
						if ( ! isTouchDevice ) {
							inputRef.current.focus();
						}
					} }
				/>
			) : (
				<DropdownIcon onClick={ () => setShowDropdown( true ) } />
			) }
			{ showDropdown && (
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
