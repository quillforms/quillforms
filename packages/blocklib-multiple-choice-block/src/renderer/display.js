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
	const { multiple, required, min, max } = attributes;
	const messages = useMessages();
	const correctIncorrectQuiz = useCorrectIncorrectQuiz();
	const [choiceClicked, setChoiceClicked] = useState(null);
	const checkfieldValidation = ($val) => {
		if (required === true && (!$val || $val.length === 0)) {
			setIsValid(false);
			setValidationErr(messages['label.errorAlert.required']);
		} else {
			if (size($val) > 0 && correctIncorrectQuiz?.enabled) {
				// $val is array of selected choices
				// const isCorrect = correctIncorrectQuiz?.questions?.[id]?.correctAnswers?.includes($val);
				// if each value from $val includes any answer from those in the correctAnswers array, then it is correct, not the opposite.

				const isCorrect = $val.every((answer) => correctIncorrectQuiz?.questions?.[id]?.correctAnswers?.includes(answer));
				console.log(isCorrect)
				// const isCorrect = correctIncorrectQuiz?.questions?.[id]?.correctAnswers?.every((answer) => $val.includes(answer));
				setIsAnswerCorrect(isCorrect);
			}
			if (multiple && min && size($val) < min) {
				setIsValid(false);
				setValidationErr(messages['label.errorAlert.minChoices']);
			}
			else if (multiple && max && size($val) > max) {
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
			multipleChoiceTimer = setTimeout(() => {
				//console.log('next calling')
				next();
			}, 600);
		}
	}, [choiceClicked]);

	useEffect(() => {
		if (isPreview || !isReviewing) checkfieldValidation(val);
	}, [attributes, correctIncorrectQuiz]);

	useEffect(() => {
		if (val?.length > 0) {
			setIsAnswered(true);
		} else {
			setIsAnswered(false);
		}
		if (multiple) {
			if (val?.length > 0) {
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
