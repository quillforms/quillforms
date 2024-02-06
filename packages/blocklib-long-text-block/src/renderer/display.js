/**
 * QuillForms Depndencies
 */
import {
	useMessages,
	HTMLParser,
	useBlockTheme,
} from '@quillforms/renderer-core';

/**
 * WordPress Dependencies
 */
import { useState, useEffect } from 'react';

/**
 * External Dependencies
 */
import tinyColor from 'tinycolor2';
import TextareaAutosize from 'react-autosize-textarea';
import { css } from 'emotion';
import classnames from 'classnames';

const LongTextOutput = (props) => {
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
		next,
		inputRef,
		isTouchScreen,
		setFooterDisplay,
		isReviewing,
		isPreview,
	} = props;
	const {
		minCharacters,
		setMaxCharacters,
		maxCharacters,
		required,
		placeholder,
	} = attributes;
	const theme = useBlockTheme(attributes.themeId);
	const messages = useMessages();
	const answersColor = tinyColor(theme.answersColor);

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

	const keyDownHandler = (e) => {
		// Enter was pressed with shift key or not
		if (e.keyCode === 13) {
			if (e.shiftKey) {
				// prevent default behavior
				e.stopPropagation();
			} else {
				e.preventDefault();
			}
		}
	};

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
		if (value !== '') {
			setIsAnswered(true);
			showNextBtn(true);
		} else {
			setIsAnswered(false);
		}
	};

	return (
		<>
			<TextareaAutosize
				ref={inputRef}
				onKeyDown={keyDownHandler}
				className={classnames(
					css`
						& {
							width: 100%;
							height: 120px;
							padding: 10px;
							border: none !important;
							outline: none;
							border-radius: 0 !important;
							padding-bottom: 8px;
							background: ${tinyColor(answersColor)
							.setAlpha(0.1)
							.toString()} !important;
							transition: box-shadow 0.1s ease-out 0s;
							resize: none;
							box-shadow: ${answersColor
							.setAlpha(0.3)
							.toString()}
								0px 3px !important;
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
								0px 4px !important;
						}

						color: ${theme.answersColor} !important;
						-webkit-appearance: none;
					`
				)}
				id={'longText-' + id}
				placeholder={
					placeholder === false
						? messages['block.longText.placeholder']
						: placeholder
				}
				onChange={changeHandler}
				value={val && val.length > 0 ? val : ''}
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
			<div
				className={classnames(
					'qf-blocklib-long-text-block-renderer__hint-text',
					css`
						margin-top: 12px;
						color: ${theme.questionsColor};
						font-size: 14px;
					`
				)}
			>
				<HTMLParser
					value={
						isTouchScreen
							? messages['block.longText.touchHint']
							: messages['block.longText.hint']
					}
				/>
			</div>
		</>
	);
};
export default LongTextOutput;
