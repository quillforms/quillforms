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

	// Convert min/max/step to numbers once
	const minValue = !isNaN(parseFloat(min)) ? parseFloat(min) : 0;
	const maxValue = !isNaN(parseFloat(max)) ? parseFloat(max) : 100;
	const stepValue = !isNaN(parseFloat(step)) ? parseFloat(step) : 1;


	const checkfieldValidation = (value) => {
		// Convert value to number for consistent comparison
		const numValue = parseFloat(value);

		if (required === true && (value === null || value === undefined || value === '')) {
			setIsValid(false);
			setValidationErr(messages['label.errorAlert.required']);
		} else {
			setIsValid(true);
			setValidationErr(null);
		}

		// Update answered state
		setIsAnswered(value !== null && value !== undefined && value !== '');
	};

	// Handle initial value
	useEffect(() => {
		// Check if val is undefined, null, or empty string
		if (val === undefined || val === null || val === '') {
			// Make sure minValue is a valid number before setting
			const initialValue = isNaN(minValue) ? 0 : minValue;
			setVal(initialValue);
		}
	}, []);

	// Validation check on attributes change
	useEffect(() => {
		if (isPreview || !isReviewing) {
			checkfieldValidation(val);
		}
	}, [attributes]);

	// Value change handler
	const handleValueChange = (event, newValue) => {
		const numValue = parseFloat(newValue);
		setVal(numValue);
		checkfieldValidation(numValue);
	};

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
				min={minValue}
				max={maxValue}
				step={stepValue}
				renderMark={mark => `${prefix}${mark}${suffix}`}
				valueLabelDisplay="on"
				valueLabelFormat={value => `${prefix}${!isNaN(value) ? value : minValue}${suffix}`}
				marks={marks === 'yes' ? true : marks === 'no' ? false : customMarks}
				renderTooltip={mark => `${prefix}${mark}${suffix}`}
				value={val !== undefined && val !== null && val !== '' ? parseFloat(val) : minValue}
				onChange={handleValueChange}
			/>
		</div>
	);
};

export default singleRangeSliderDisplay;