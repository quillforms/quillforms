/**
 * QuillForms Depndencies
 */
import { useMessages, useCorrectIncorrectQuiz } from '@quillforms/renderer-core';

/**
 * WordPress Dependencies
 */
import { useEffect, useState } from 'react';

/**
 * External Dependencies
 */
import { set, size } from 'lodash';

/**
 * Internal Dependencies
 */
import ChoicesWrapper from './choices-wrapper';

let multipleChoiceTimer;
const MultipleChoiceOutput = (props) => {
	const {
		id,
		attributes,
		setIsValid,
		setIsAnswered,
		showNextBtn,
		setValidationErr,
		val,
		setVal,
		next,
		isAnswerLocked,
		isActive,
		isAnimating,
		showErrMsg,
		isPreview,
		isReviewing,
		setIsAnswerCorrect
	} = props;
	const { multiple, required, min, max, other } = attributes;
	const messages = useMessages();
	const correctIncorrectQuiz = useCorrectIncorrectQuiz();
	const [choiceClicked, setChoiceClicked] = useState(null);

	const checkfieldValidation = ($val) => {
		if (required === true && (!$val || $val.length === 0)) {
			setIsValid(false);
			setValidationErr(messages['label.errorAlert.required']);
		} else {
			if (size($val) > 0 && correctIncorrectQuiz?.enabled) {
				// Handle "Other" option in quiz validation
				const regularChoices = $val?.filter(item => typeof item !== 'object' || item.type !== 'other');
				const otherChoice = $val?.find(item => typeof item === 'object' && item.type === 'other');

				// For quiz validation, we only consider regular choices
				if (regularChoices.length > 0) {
					const isCorrect = regularChoices.every((answer) => correctIncorrectQuiz?.questions?.[id]?.correctAnswers?.includes(answer));
					setIsAnswerCorrect(isCorrect);
				} else {
					setIsAnswerCorrect(false);
				}
			}

			// Count valid selections (including "Other" with text)
			const validSelections = $val?.filter(item => {
				if (typeof item === 'object' && item.type === 'other') {
					return item.value && item.value.trim() !== '';
				}
				return true;
			});

			if (multiple && min && size(validSelections) < min) {
				setIsValid(false);
				setValidationErr(messages['label.errorAlert.minChoices']);
			}
			else if (multiple && max && size(validSelections) > max) {
				setIsValid(false);
				setValidationErr(messages['label.errorAlert.maxChoices']);
			}
			else {
				setIsValid(true);
				setValidationErr(null);
			}
		}
	};

	useEffect(() => {
		return () => clearTimeout(multipleChoiceTimer);
	}, []);

	useEffect(() => {
		if (!isActive) {
			clearTimeout(multipleChoiceTimer);
		}
		if (!isActive && !isAnimating) {
			setChoiceClicked(null);
		}
	}, [isActive, isAnimating]);

	useEffect(() => {
		clearTimeout(multipleChoiceTimer);
		if (choiceClicked && val?.length > 0 && !multiple) {
			// For single choice, check if we have a valid selection
			const hasValidSelection = val.some(item => {
				if (typeof item === 'object' && item.type === 'other') {
					return item.value && item.value.trim() !== '';
				}
				return true;
			});

			if (hasValidSelection) {
				multipleChoiceTimer = setTimeout(() => {
					next();
				}, 600);
			}
		}
	}, [choiceClicked, val]);

	useEffect(() => {
		if (isPreview || !isReviewing) checkfieldValidation(val);
	}, [attributes, correctIncorrectQuiz]);

	useEffect(() => {
		// Check if we have valid selections
		const hasValidSelections = val && val.length > 0 && val.some(item => {
			if (typeof item === 'object' && item.type === 'other') {
				return item.value && item.value.trim() !== '';
			}
			return true;
		});

		if (hasValidSelections) {
			setIsAnswered(true);
		} else {
			setIsAnswered(false);
		}
		if (multiple) {
			if (hasValidSelections) {
				showNextBtn(true);
			}
		}
	}, [val, attributes]);

	return (
		<div className="qf-multiple-choice-block-renderer">
			<ChoicesWrapper
				attributes={attributes}
				id={id}
				val={val}
				isActive={isActive}
				isAnswerLocked={isAnswerLocked}
				correctIncorrectQuiz={correctIncorrectQuiz}
				checkfieldValidation={checkfieldValidation}
				setVal={setVal}
				setChoiceClicked={(val) => {
					showErrMsg(false);
					setChoiceClicked(val);
				}}
			/>
		</div>
	);
};
export default MultipleChoiceOutput;
