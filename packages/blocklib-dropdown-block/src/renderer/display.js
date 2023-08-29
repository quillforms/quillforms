/* eslint-disable no-nested-ternary */
/**
 * QuillForms Dependencies
 */
import { useMessages, useBlockTheme } from '@quillforms/renderer-core';
import { useCx, css } from '@quillforms/utils';

/**
 * WordPress Dependencies
 */
import {
	useState,
	useEffect,
	useRef,
	useMemo
} from 'react';
import { createPortal } from 'react-dom';
import { useSelect } from '@wordpress/data';

/**
 * External Dependencies
 */
import tinyColor from 'tinycolor2';
import classnames from 'classnames';
import { cloneDeep } from 'lodash';

/**
 * Internal Dependencies
 */
import DropdownIcon from './expand-icon';
import CloseIcon from './close-icon';
import ChoiceItem from './choice-item';
import * as styles from './styles';

const ENTER_CODE = 13;
const ESC_CODE = 27;
const ARROW_UP_CODE = 38;
const ARROW_DOWN_CODE = 40;

let timer;
let timer2;
let timer3;
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
		isReviewing,
	} = props;
	const { choices, required } = attributes;
	const cx = useCx();
	const isIframed = window.self !== window.top;
	const theme = useBlockTheme(attributes.themeId);
	const [showDropdown, setShowDropdown] = useState(false);
	const [searchKeyword, setSearchKeyword] = useState('');
	const [selectedChoiceIndex, setSelectedChoiceIndex] = useState(-1);
	const [clicked, setClicked] = useState(false);
	const [goNext, setGoNext] = useState(false);
	const [showCloseIcon, setShowCloseIcon] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const [showFixedDropdownInDom, setShowFixedDropdownInDom] =
		useState(false);
	const [showFDrop, setShowFDrop] = useState(false);
	const wrapperRef = useRef();
	const choicesWrappeerRef = useRef();
	const messages = useMessages();
	const answersColor = tinyColor(theme.answersColor);
	const $choices = useMemo(() => {
		return cloneDeep(choices)
			.map((choice, index) => {
				if (!choice.label) choice.label = 'Choice ' + (index + 1);
				return choice;
			})
			.filter((choice) =>
				choice.label
					.toLowerCase()
					.includes(
						val && isTouchScreen ? '' : searchKeyword.toLowerCase()
					)
			);
	}, [choices, searchKeyword]);

	const checkFieldValidation = ($val) => {
		if (required === true && (!$val || $val === '')) {
			setIsValid(false);
			setValidationErr(
				messages['label.errorAlert.selectionRequired']
			);
		} else {
			setIsValid(true);
			setValidationErr(null);
		}
	};

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
		} else if (
			document.querySelector(
				`#block-${id} .renderer-core-field-footer`
			)
		) {
			document
				.querySelector(`#block-${id} .renderer-core-field-footer`)
				.classList.remove('is-hidden');
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
	}, [attributes]);

	useEffect(() => {
		if (showFDrop) {
			setShowFixedDropdownInDom(showFDrop);
			setFooterDisplay(false);
		} else {
			timer3 = setTimeout(() => {
				setShowFixedDropdownInDom(showFDrop);
			}, 500);
		}

		return () => clearTimeout(timer3);
	}, [showFDrop]);

	const changeHandler = (e) => {
		// show close icon of there is any string
		setShowCloseIcon(e.target.value !== '');
		setInputValue(e.target.value);
		if (!isTouchScreen || isIframed) setShowDropdown(true);
		if (val) {
			setVal(null);
			setSearchKeyword('');
			checkFieldValidation(undefined);
			return;
		}
		setSearchKeyword(e.target.value);
	};

	useEffect(() => {
		if (!isActive) {
			//clearTimeout( timer );
			if (timer2) clearTimeout(timer2);
		}
		setGoNext(false);
	}, [isActive]);

	useEffect(() => {
		if (val) {
			const selectedChoice = $choices.find(
				(choice) => choice.value === val
			);
			setSearchKeyword(selectedChoice ? selectedChoice.label : '');
		}
		return () => {
			// clearTimeout( timer );
			timer2 && clearTimeout(timer2);
		};
	}, []);

	useEffect(() => {
		if (goNext) {
			next();
		}
	}, [goNext])

	function checkInView(container, element) {
		//Get container properties
		const cTop = container.scrollTop;
		const cBottom = cTop + container.clientHeight;

		//Get element properties
		const eTop = element.offsetTop;
		const eBottom = eTop + element.clientHeight;

		//Check if in view
		return eTop >= cTop + 10 && eBottom <= cBottom - 50;
	}

	const handleChoiceKeyDown = (e) => {
		if (isTouchScreen) return;
		if (e.keyCode === ESC_CODE) {
			setShowDropdown(false);
			setShowCloseIcon(inputValue !== '');
			setSelectedChoiceIndex(-1);
			return;
		}

		if (e.keyCode === ARROW_UP_CODE || e.keyCode === ARROW_DOWN_CODE) {
			const block = document.querySelector(
				`#block-${id}  .qf-block-dropdown-display__choices`
			);
			if (
				!block ||
				(selectedChoiceIndex <= 0 && e.keyCode === ARROW_UP_CODE) ||
				(selectedChoiceIndex === $choices.length - 1 &&
					e.keyCode === ARROW_DOWN_CODE)
			) {
				return;
			}
			setShowDropdown(true);
			const newChoiceIndex =
				e.keyCode === ARROW_UP_CODE
					? selectedChoiceIndex - 1
					: selectedChoiceIndex + 1;
			setSelectedChoiceIndex(newChoiceIndex);
			const choiceEl = document.getElementById(
				`block-${id}-option-${newChoiceIndex}`
			);
			if (!checkInView(block, choiceEl)) {
				block.scrollTop = choiceEl.offsetTop - 30;
			}
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
			// selectedChoiceIndex > 4 &&
			// 	document
			// 		.querySelector( '.qf-block-dropdown-display__choices' )
			// 		.scrollTo( 0, ( selectedChoiceIndex - 3 ) * 49 );
		}
	};

	const clickHandler = (choice = $choices[selectedChoiceIndex]) => {
		const selectedIndex = $choices.findIndex(
			(c) => c.value === choice.value
		);
		if (selectedIndex !== selectedChoiceIndex)
			setSelectedChoiceIndex(selectedIndex);
		setClicked(false);
		setShowCloseIcon(false);
		showErrMsg(false);
		clearTimeout(timer);
		if (timer2) clearTimeout(timer2);
		if (val && val === choice.value) {
			setVal(null);
			setIsAnswered(false);
			setSearchKeyword('');
			checkFieldValidation(undefined);
			setGoNext(false);
			return;
		}
		setIsAnswered(true);
		setVal(choice.value);
		checkFieldValidation(choice.value)

		timer = setTimeout(
			() => {
				setSearchKeyword(choice.label);
				setShowDropdown(false);
				setSelectedChoiceIndex(-1);
				if (isTouchScreen && !isIframed) {
					setShowFDrop(false);
					setFooterDisplay(true);
					// timer2 for showing the input after choosing value
					timer2 = setTimeout(() => {
						setGoNext(true)
					}, 750);
				} else {
					setGoNext(true);
				}
			},
			isTouchScreen ? 500 : 700
		);
	};

	return (
		<div ref={wrapperRef} style={{ position: 'relative' }}>
			<input
				autoComplete="off"
				ref={inputRef}
				className={cx(
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
				value={
					val && isTouchScreen
						? searchKeyword
						: !isTouchScreen
							? searchKeyword
							: ''
				}
				onClick={() => {
					if (isTouchScreen && !isIframed) {
						setShowFDrop(true);
						inputRef?.current?.blur();
					} else {
						setShowDropdown(true);
					}
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
			{(val && val.length > 0) ||
				(showCloseIcon && (!isTouchScreen || isIframed)) ? (
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
				<DropdownIcon
					style={{
						transform: `${showDropdown ? 'rotate(180deg)' : 'rotate(0deg)'
							}`,
					}}
					onClick={() => {
						showDropdown && setSelectedChoiceIndex(-1);
						if (isTouchScreen) {
							setShowFDrop(!showFDrop);
						} else {
							setShowDropdown(!showDropdown);
							inputRef.current.focus();
						}
					}}
					onKeyDown={(e) => {
						if (e.keyCode === ENTER_CODE) {
							e.stopPropagation();
							showDropdown && setSelectedChoiceIndex(-1);
							if (isTouchScreen) {
								setShowFDrop(!showFDrop);
							} else {
								setShowDropdown(!showDropdown);
								inputRef.current.focus();
							}
						}
					}}
				/>
			)}

			{showDropdown && (
				<div
					className={cx(
						'qf-block-dropdown-display__choices',
						{
							visible: showDropdown,
						},
						styles.DropdownChoices,
						css`
							background: ${theme.backgroundColor};
							padding: 15px;
							border: 1px dashed ${theme.answersColor};
						`
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
									blockId={id}
									choiceIndex={index}
									hovered={index === selectedChoiceIndex}
									clicked={
										index === selectedChoiceIndex && clicked
									}
									role="presentation"
									key={`block-dropdown-${id}-choice-${choice.value}`}
									clickHandler={() =>
										clickHandler(choice)
									}
									choice={choice}
									val={val}
									showDropdown={showDropdown}
								/>
							);
						})
					) : (
						<div
							className={cx(css`
								background: ${theme.errorsBgColor};
								color: ${theme.errorsFontColor};
								display: inline-block;
								padding: 5px 10px;
								border-radius: 5px;
							` )}
						>
							{messages['block.dropdown.noSuggestions']}
						</div>
					)}
				</div>
			)}

			{showFixedDropdownInDom && (
				<>
					{createPortal(
						<div
							className={cx(
								'fixed-dropdown',
								{
									show: showFDrop,
									hide: !showFDrop,
								},
								styles.FixedDropdown(theme)
							)}
							onWheel={(e) => e.stopPropagation()}
						>
							<div
								className="fixed-dropdown-content"
								onWheel={(e) => {
									e.stopPropagation();
								}}
							>
								<div
									className={cx(
										css`
											display: flex;
											align-items: center;
										`
									)}
								>
									<svg
										onClick={() => {
											setShowFDrop(false);
										}}
										className="back-icon"
										focusable="false"
										viewBox="0 0 16 16"
										aria-hidden="true"
										role="presentation"
									>
										<path d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"></path>
									</svg>
									<input
										autoFocus={false}
										className={cx(
											css`
												& {
													width: 100%;
													border: none;
													outline: none;
													padding-bottom: 8px;
													background: transparent;
													margin-bottom: 10px;
													transition: box-shadow 0.1s
														ease-out 0s;
													box-shadow: ${answersColor
													.setAlpha(0.3)
													.toString()}
														0px 1px;
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
										placeholder={
											messages[
											'block.dropdown.placeholder'
											]
										}
										onChange={changeHandler}
										value={searchKeyword}
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
								<div
									className="qf-block-dropdown-display__choices visible fixed-choices"
									ref={choicesWrappeerRef}
									onWheel={(e) => {
										if (showFixedDropdownInDom) {
											e.stopPropagation();
										}
									}}
								>
									{$choices?.length > 0 ? (
										$choices.map((choice, index) => {
											return (
												<ChoiceItem
													hovered={
														index ===
														selectedChoiceIndex
													}
													choiceIndex={index}
													blockId={id}
													clicked={
														index ===
														selectedChoiceIndex &&
														clicked
													}
													role="presentation"
													key={`block-dropdown-${id}-choice-${choice.value}`}
													clickHandler={() =>
														clickHandler(choice)
													}
													choice={choice}
													val={val}
													showDropdown={
														showDropdown
													}
												/>
											);
										})
									) : (
										<div
											className={cx(css`
												background: ${theme.errorsBgColor};
												color: ${theme.errorsFontColor};
												display: inline-block;
												padding: 5px 10px;
												border-radius: 5px;
											` )}
										>
											{
												messages[
												'block.dropdown.noSuggestions'
												]
											}
										</div>
									)}
								</div>
							</div>
						</div>,
						document.querySelector('.renderer-core-form-flow')
					)}
				</>
			)}
		</div>
	);
};
export default DropdownDisplay;
