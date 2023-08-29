/**
 * QuillForms Dependencies
 */
import { useMessages, useBlockTheme } from '@quillforms/renderer-core';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { useEffect } from 'react';

/**
 * External Dependencies
 */
import tinyColor from 'tinycolor2';
import { css } from 'emotion';
import classnames from 'classnames';
import * as EmailValidator from 'email-validator';

const EmailOutput = (props) => {
	const {
		id,
		attributes,
		setIsValid,
		setIsAnswered,
		setValidationErr,
		showNextBtn,
		val,
		setVal,
		showErrMsg,
		next,
		inputRef,
		isTouchScreen,
		setFooterDisplay,
		isPreview,
		isReviewing,
	} = props;
	const theme = useBlockTheme(attributes.themeId);
	const messages = useMessages();
	const answersColor = tinyColor(theme.answersColor);
	const { required, placeholder } = attributes;

	const checkFieldValidation = (value) => {
		if (
			required === true &&
			(!value || value === '' || value.length === 0)
		) {
			setIsValid(false);
			setValidationErr(messages['label.errorAlert.required']);
		} else if (
			value &&
			!EmailValidator.validate(value) &&
			value.length > 0
		) {
			setIsValid(false);
			setValidationErr(messages['label.errorAlert.email']);
		} else {
			setIsValid(true);
			setValidationErr(null);
		}
	};

	useEffect(() => {
		if (isPreview || !isReviewing) checkFieldValidation(val);
	}, [required]);

	const changeHandler = (e) => {
		const value = e.target.value;
		checkFieldValidation(value);
		setVal(value);
		showErrMsg(false);
		if (!value) {
			setIsAnswered(false);
		} else {
			setIsAnswered(true);
			showNextBtn(true);
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
						outline: none;
						padding-bottom: 8px !important;
						padding-left: 0 !important;
						padding-right: 0 !important;
						border-radius: 0 !important;
						background: transparent;
						background-color: transparent !important;
						transition: box-shadow 0.1s ease-out 0s;
						-webkit-appearance: none;
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
						border: none !important;
						outline: none !important;
					}

					color: ${theme.answersColor} !important;
				`
			)}
			id={'email-' + id}
			type="email"
			placeholder={
				placeholder === false
					? messages['block.email.placeholder']
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
	);
};
export default EmailOutput;
