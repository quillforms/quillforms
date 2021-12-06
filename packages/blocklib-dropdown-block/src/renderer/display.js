/* eslint-disable no-nested-ternary */
/**
 * QuillForms Dependencies
 */
import { useTheme, useMessages } from '@quillforms/renderer-core';

/**
 * WordPress Dependencies
 */
import { useState, useEffect, useRef, useMemo } from '@wordpress/element';
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
let timer2;
const DropdownDisplay = (props) => {
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
	const [showDropdown, setShowDropdown] = useState(false);
	const [firstDropdown, setFirstDropdown] = useState(true);
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
	const answersColor = tinyColor(theme.answersColor);
	const $choices = useMemo(() => {
		return cloneDeep(choices)
			.map((choice, index) => {
				if (!choice.label) choice.label = 'Choice ' + (index + 1);
				return choice;
			})
			.filter((choice) =>choice.label.toLowerCase().includes(isTouchScreen? '' : searchKeyword.toLowerCase())
			);
	}, [choices, searchKeyword])

	const checkFieldValidation = () => {
		if (required === true && (!val || val === '')) {
			setIsValid(false);
			setValidationErr(
				messages['label.errorAlert.selectionRequired']
			);
		} else {
			setIsValid(true);
			setValidationErr(null);
		}
	};

	const { isReviewing } = useSelect((select) => {
		return {
			isReviewing: select('quillForms/renderer-core').isReviewing(),
		};
	});

	// Handle click outside the countries dropdown
	const handleClickOutside = (e) => {
		if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
			setShowDropdown(false);
			setSelectedChoiceIndex(-1);
		}
	};

	// Attaching the previous event with UseEffect hook
	useEffect(() => {
		if (showDropdown) {
			// Bind the event listener
			document.addEventListener('mousedown', handleClickOutside);
			if (
				document.querySelector(
					`#block-${id} .renderer-core-field-footer`
				)
			) {
				document
					.querySelector(
						`#block-${id} .renderer-core-field-footer`
					)
					.classList.add('is-hidden');
			}
		} else {
			if (
				document.querySelector(
					`#block-${id} .renderer-core-field-footer`
				)
			) {
				document
					.querySelector(
						`#block-${id} .renderer-core-field-footer`
					)
					.classList.remove('is-hidden');
			}
		}
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showDropdown]);

	useEffect(() => {
		// if change in attributes and is in preview mode, check validation
		// Note, that this effect will also be called on mount, that's why we check if isReviewing = false
		// because we want to display errors coming from server.
		if (isPreview || !isReviewing) checkFieldValidation(val);
	}, [val, attributes]);

	const changeHandler = (e) => {
		// show close icon of there is any string
		setShowCloseIcon(e.target.value !== '');
		setInputValue(e.target.value);
	 	!isTouchScreen &&	setShowDropdown(true);
		if (val) {
			setVal(null);
			setSearchKeyword('');
			return;
		}
		setSearchKeyword(e.target.value);
	};

	useEffect(() => {
		if (!isActive) {
			clearTimeout(timer);
			timer2 && clearTimeout(timer2);
		}
	}, [isActive]);

	useEffect(() => {
		if (val) {
			console.log('val',val)
			const selectedChoice = $choices.find(
				(choice) => choice.value === val
			);
			setSearchKeyword(selectedChoice ? selectedChoice.label : '');
		}
		return () => {
			clearTimeout(timer);
			timer2 && clearTimeout(timer2);
		}
	}, []);

	const handleChoiceKeyDown = (e) => {
		if (isTouchScreen) return;
		if (e.keyCode === ESC_CODE) {
			setShowDropdown(false);
			setFirstDropdown(true);
			setShowCloseIcon(inputValue !== '');
			setSelectedChoiceIndex(-1);
		}

		if (e.keyCode === ARROW_UP_CODE) {
			if (selectedChoiceIndex <= 0) {
				return;
			}
			!showDropdown && setShowDropdown(true);
			let block = document.querySelector('.qf-block-dropdown-display__choices');
			if (!block) return;
			let element = block.children[selectedChoiceIndex < 0 ? 0 : selectedChoiceIndex];
			let elHeight = element.getBoundingClientRect().height;
			elHeight += parseInt(window.getComputedStyle(element).getPropertyValue('margin-bottom'));
		    setSelectedChoiceIndex(selectedChoiceIndex - 1);
			if ((element.offsetTop - block.scrollTop) < elHeight * 2) {
				block.scrollTo({
					top: block.scrollTop - elHeight,
				})
			}
			return;
		}

		if (e.keyCode === ARROW_DOWN_CODE) {
			if (selectedChoiceIndex === $choices.length - 1) {
				return;
			}
			console.log('ARROW_DOWN_CODE');
			!showDropdown && setShowDropdown(true);
			setSelectedChoiceIndex(selectedChoiceIndex + 1);
			let block = document.querySelector('.qf-block-dropdown-display__choices');
			if (!block) return;
			let element = block.children[selectedChoiceIndex < 0 ? 0 : selectedChoiceIndex];
			let elHeight = element.getBoundingClientRect().height;
			elHeight += parseInt(window.getComputedStyle(element).getPropertyValue('margin-bottom'));
			if ((element.offsetTop - block.scrollTop) > elHeight * 4) block.scrollTo({
				top: block.scrollTop + elHeight
			});
			return;
		}

		if (e.keyCode === ENTER_CODE) {
			e.stopPropagation();
			if (selectedChoiceIndex === -1) {
				setShowDropdown(false);
				setSelectedChoiceIndex(-1);
				return;
			}
			setClicked(true);
			selectedChoiceIndex > 4 && document.querySelector('.qf-block-dropdown-display__choices').scrollTo(0, (selectedChoiceIndex - 3) * 49);
			return;
		}
	}
	
	const clickHandler = (choice = $choices[selectedChoiceIndex]) => {
		const selectedIndex = $choices.findIndex(c => c.value === choice.value);
		if (selectedIndex !== selectedChoiceIndex) setSelectedChoiceIndex(selectedIndex);
		setClicked(false);
		setShowCloseIcon(false);
		showErrMsg(false);
		clearTimeout(timer);
		timer2 && clearTimeout(timer2);
		if (val && val === choice.value) {
			setVal(null);
			setIsAnswered(false);
			setSearchKeyword('');
			return;
		}
		setIsAnswered(true);
		setVal(choice.value);
		timer = setTimeout(() => {
			setSearchKeyword(choice.label);
			setShowDropdown(false);
			setSelectedChoiceIndex(-1);
			if (isTouchScreen) {
				// timer2 for showing the input after choosing value
				timer2 = setTimeout(() => {
					next();
				}, 500);
			} else {
				next();
			}
		}, isTouchScreen? 500 : 700);
	}

	return (
		<div ref={wrapperRef} style={{ position: 'relative' }}>
			<input
				ref={inputRef}
				className={classnames(
					css`
						& {
							width: 100%;
							border: none;
							outline: none;
							font-size: 30px;
							padding-bottom: 8px;
							background: transparent;
							transition: box-shadow 0.1s ease-out 0s;
							box-shadow: ${answersColor
							.setAlpha(0.3)
							.toString()}
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
							color: ${theme.answersColor};
						}

						&:-ms-input-placeholder {
							opacity: 0.3;
							/* Internet Explorer 10-11 */
							color: ${theme.answersColor};
						}

						&::-ms-input-placeholder {
							opacity: 0.3;
							/* Microsoft Edge */
							color: ${theme.answersColor};
						}

						&:focus {
							box-shadow: ${answersColor
							.setAlpha(1)
							.toString()}
								0px 2px;
						}

						color: ${theme.answersColor};
					`
				)}
				id={'dropdown-' + id}
				placeholder={messages['block.dropdown.placeholder']}
				onChange={changeHandler}
				value={searchKeyword}
				onClick={() => {
					if (isTouchScreen) setShowFixedDropdown(true);
					setShowDropdown(true);
				}}
				onFocus={() => {
					if (isTouchScreen) {
						setFooterDisplay(false);
					}
				}}
				onBlur={() => {
					if (isTouchScreen) {
						setFooterDisplay(true);
					}
				}}
				onKeyDown={handleChoiceKeyDown}
				autoComplete="off"
			/>
			{(val && val.length > 0) || showCloseIcon ? (
				<CloseIcon
					onClick={() => {
						clearTimeout(timer);
						timer2 && clearTimeout(timer2);
						setSearchKeyword('');
						setIsAnswered(false);
						setVal(undefined);
						setShowCloseIcon(false);
						if (!isTouchScreen) {
							inputRef.current.focus();
						}
					}}
				/>
			) : (
					<DropdownIcon style={{ transform: `${showDropdown ? 'rotate(180deg)' : 'rotate(0deg)'}` }} onClick={() => {
						showDropdown && setSelectedChoiceIndex(-1);
						setShowDropdown(!showDropdown);
						inputRef.current.focus()
					}} onKeyDown={(e) => {
					if (e.keyCode === ENTER_CODE) {
						e.stopPropagation();
						setShowDropdown(!showDropdown);
						!showDropdown && setFirstDropdown(true);
					} else {
						return;
					}
				}} />
			)}
			
			{showDropdown && (
				<div className={showFixedDropdown && 'fixed-dropdown'}>
					{
						showFixedDropdown &&
						<div className={
							classnames(
								css`
								display: flex;
    							align-items: center;
								`
							)
						}>
							<svg
								onClick={() => { setShowDropdown(false); setShowFixedDropdown(false); }}
								className="back-icon"
								focusable="false"
								viewBox="0 0 16 16"
								aria-hidden="true"
								role="presentation">
								<path d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"></path>
							</svg>
							<input className={classnames(
								css`
						& {
							width: 100%;
							border: none;
							outline: none;
							font-size: 30px;
							padding-bottom: 8px;
							background: transparent;
							margin-bottom: 10px;
							transition: box-shadow 0.1s ease-out 0s;
							box-shadow: ${answersColor
										.setAlpha(0.3)
										.toString()}
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
							color: ${theme.answersColor};
						}

						&:-ms-input-placeholder {
							opacity: 0.3;
							/* Internet Explorer 10-11 */
							color: ${theme.answersColor};
						}

						&::-ms-input-placeholder {
							opacity: 0.3;
							/* Microsoft Edge */
							color: ${theme.answersColor};
						}

						&:focus {
							box-shadow: ${answersColor
										.setAlpha(1)
										.toString()}
								0px 2px;
						}

						color: ${theme.answersColor};
					`
							)}
								placeholder={messages['block.dropdown.placeholder']}
								onChange={changeHandler}
								onFocus={() => {
									setFooterDisplay(false);
								}}
								onBlur={() => {
									setFooterDisplay(true);
								}}
								onKeyDown={handleChoiceKeyDown}
								autoComplete="off"
							/>
						</div>
					}
					<div
						className={
							classnames(
								'qf-block-dropdown-display__choices' , {
									visible: showDropdown,
									'fixed-choices': showFixedDropdown
								}
							)}
						ref={choicesWrappeerRef}
						onWheel={(e) => {
							if (showDropdown) {
								e.stopPropagation();
							}
						}}
					>
						
						{$choices?.length > 0 ? (
							$choices.map((choice, index) => {
								return (
									<ChoiceItem
										hovered={index === selectedChoiceIndex}
										clicked={index === selectedChoiceIndex && clicked}
										role="presentation"
										key={`block-dropdown-${id}-choice-${choice.value}`}
										clickHandler={() => clickHandler(choice)}
										choice={choice}
										val={val}
										showDropdown={showDropdown}
									/>
								);
							})
						) : (
							<div
								className={css`
									background: ${theme.errorsBgColor};
									color: ${theme.errorsFontColor};
									display: inline-block;
									padding: 5px 10px;
									border-radius: 5px;
								` }
							>
								{messages['block.dropdown.noSuggestions']}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
export default DropdownDisplay;
