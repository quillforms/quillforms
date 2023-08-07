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
import Slider from '@mui/material/Slider';
const singleRangeSliderDisplay = (props) => {
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
		min,
		max,
		step,
		marks,
		customMarks,
		prefix,
		suffix,
		required,
	} = attributes;

	const checkfieldValidation = (value) => {
		if (required === true && (!value || value === '') && value !== 0) {
			setIsValid(false);
			setValidationErr(messages['label.errorAlert.required']);
		} else {
			setIsValid(true);
			setValidationErr(null);
		}
	};


	useEffect(() => {
		if (isPreview || !isReviewing) checkfieldValidation(val);
	}, [attributes]);


	return (
		<div className={css`
			margin: 40px 0 0;

			.MuiSlider-root  {
				color: ${theme.answersColor};
			}

			.MuiSlider-mark {
				width: 10px;
				height: 10px;
				border-radius: 50%;
			}
		   .css-14pt78w-MuiSlider-rail {
			   height: 10px
		   }
		   .MuiSlider-track {
			   height: 10px
		   }

		`}>
			<Slider
				min={parseFloat(min)}
				max={parseFloat(max)}
				step={parseFloat(step)}
				renderMark={mark => {
					return prefix + mark + suffix;
				}}
				valueLabelDisplay="on"
				valueLabelFormat={val => {
					return prefix + val + suffix;
				}}
				marks={marks === 'yes' ? true : marks === 'no' ? false : customMarks}
				renderTooltip={mark => {
					return prefix + mark + suffix;
				}}
				value={typeof val === 'undefined' ? 0 : parseFloat(val)}
				onChange={e => {
					setVal(e.target.value);
					checkfieldValidation(e.target.value);
				}}
			/>
		</div>
	);
};
export default singleRangeSliderDisplay;
