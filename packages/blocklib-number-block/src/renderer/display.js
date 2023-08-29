/* eslint-disable no-nested-ternary */
/**
 * QuillForms Depndencies
 */
import { useMessages, useBlockTheme } from '@quillforms/renderer-core';

/**
 * WordPress Dependencies
 */
import { useState, useEffect } from 'react';

/**
 * External Dependencies
 */
import tinyColor from 'tinycolor2';
import { css } from 'emotion';
import classnames from 'classnames';

const NumberOutput = (props) => {
	const {
		id,
		attributes,
		setIsValid,
		setIsAnswered,
		setValidationErr,
		showNextBtn,
		blockWithError,
		val,
		setVal,
		showErrMsg,
		inputRef,
		isTouchScreen,
		setFooterDisplay,
		isPreview,
		isReviewing,
	} = props;
	const { setMax, max, setMin, min, required, placeholder } = attributes;
	const messages = useMessages();
	const theme = useBlockTheme(attributes.themeId);
	const answersColor = tinyColor(theme.answersColor);

	const checkfieldValidation = (value) => {
		if (required === true && value !== 0 && (!value || value === '')) {
			setIsValid(false);
			setValidationErr(messages['label.errorAlert.required']);
		} else if (setMax && max > 0 && value > max) {
			setIsValid(false);
			setValidationErr(messages['label.errorAlert.maxNum']);
		} else if (setMin && min >= 0 && value < min) {
			setIsValid(false);
			setValidationErr(messages['label.errorAlert.minNum']);
		} else {
			setIsValid(true);
			setValidationErr(null);
		}
	};

	useEffect(() => {
		if (isPreview || !isReviewing) checkfieldValidation(val);
	}, [attributes]);

	const changeHandler = (e) => {
		e.preventDefault();

		const value = e.target.value;
		if (isNaN(value)) {
			blockWithError('Numbers only!');
			return;
		}
		if (value !== 0 && !value) {
			setVal('');
			checkfieldValidation('');
			setIsAnswered(false);
		} else {
			const newVal = value == 0 ? 0 : parseInt(value);
			setVal(newVal);
			showErrMsg(false);
			checkfieldValidation(newVal);
			setIsAnswered(true);
		}
	};

	let specialProps = {};
	if (isTouchScreen) {
		specialProps = {
			type: 'number',
		};
	}
	return (
		<input
			{...specialProps}
			ref={inputRef}
			className={classnames(
				css`
					& {
						width: 100%;
						border: none !important;
						outline: none;
						padding-bottom: 8px;
						border-radius: 0 !important;
						background: transparent;
						background-color: transparent !important;
						transition: box-shadow 0.1s ease-out 0s;
						box-shadow: ${answersColor.setAlpha(0.3).toString()}
							0px 1px !important;

						-moz-appearance: textfield;
						-webkit-appearance: none;
						&::-webkit-outer-spin-button,
						&::-webkit-inner-spin-button {
							-webkit-appearance: none;
							margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
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
						box-shadow: ${answersColor.setAlpha(1).toString()}
							0px 2px !important;
						border: none !important;
						outline: none !important;
					}

					color: ${theme.answersColor};
				`
			)}
			id={'number-' + id}
			placeholder={
				placeholder === false
					? messages['block.number.placeholder']
					: placeholder
			}
			onChange={changeHandler}
			value={val || val === 0 ? val : ''}
			onFocus={() => {
				if (isTouchScreen) {
					setFooterDisplay(false);
				}
			}}
			onWheel={(e) => e.target.blur()}
			onBlur={() => {
				if (isTouchScreen) {
					setFooterDisplay(true);
				}
			}}
			autoComplete="off"
		/>
	);
};
export default NumberOutput;
