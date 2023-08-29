/**
 * QuillForms Dependencies
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

const ShortTextOutput = (props) => {
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
	const messages = useMessages();
	const theme = useBlockTheme(attributes.themeId);
	const answersColor = tinyColor(theme.answersColor);

	const {
		minCharacters,
		maxCharacters,
		setMaxCharacters,
		required,
		placeholder,
	} = attributes;

	const checkfieldValidation = (value) => {
		if (required === true && (!value || value === '')) {
			setIsValid(false);
			setValidationErr(messages['label.errorAlert.required']);
		} else if (
			setMaxCharacters &&
			maxCharacters > 0 &&
			value?.length > maxCharacters
		) {
			setIsValid(false);
			setValidationErr(messages['label.errorAlert.maxCharacters']);
		} else if (
			minCharacters !== false &&
			minCharacters > 0 &&
			value?.length < minCharacters
		) {
			setIsValid(false);
			setValidationErr(messages['label.errorAlert.minCharacters']);
		} else {
			setIsValid(true);
			setValidationErr(null);
		}
	};

	useEffect(() => {
		if (isPreview || !isReviewing) checkfieldValidation(val);
	}, [attributes]);

	const changeHandler = (e) => {
		const value = e.target.value;
		if (
			setMaxCharacters &&
			maxCharacters > 0 &&
			value.length > maxCharacters
		) {
			blockWithError(messages['label.errorAlert.maxCharacters']);
		} else {
			setVal(value);
			showErrMsg(false);
			checkfieldValidation(value);
		}
		if (value && value !== '') {
			setIsAnswered(true);
			showNextBtn(true);
		} else {
			setIsAnswered(false);
		}
	};

	return (
		<input
			ref={inputRef}
			className={classnames(
				css`
					& {
						width: 100%;
						border: none !important;
						border-radius: 0 !important;
						outline: none;
						padding-bottom: 8px;
						background: transparent;
						transition: box-shadow 0.1s ease-out 0s;
						box-shadow: ${answersColor.setAlpha(0.3).toString()}
							0px 1px !important;
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
					}

					color: ${theme.answersColor} !important;
					-webkit-appearance: none;
				`
			)}
			id={'short-text-' + id}
			placeholder={
				placeholder === false
					? messages['block.shortText.placeholder']
					: placeholder
			}
			onChange={changeHandler}
			value={val ? val.toString() : ''}
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
			autoComplete="off"
		/>
	);
};
export default ShortTextOutput;
