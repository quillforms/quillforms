/**
 * QuillForms Depndencies
 */
import { useMessages } from '@quillforms/renderer-core';

/**
 * WordPress Dependencies
 */
import { useEffect, useState } from 'react';

/**
 * External Dependencies
 */
import { size } from 'lodash';

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
		isActive,
		isAnimating,
		showErrMsg,
		isPreview,
		isReviewing,
	} = props;
	const { required, yesLabel, noLabel } = attributes;
	const messages = useMessages();
	const [choiceClicked, setChoiceClicked] = useState(null);
	const checkfieldValidation = ($val) => {
		if (required === true && (!$val || $val.length === 0 || $val === '' || $val !== 'yes')) {
			setIsValid(false);
			setValidationErr(messages['label.errorAlert.required']);
		} else {
			setIsValid(true);
			setValidationErr(null);
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
		if (choiceClicked && val?.length > 0) {
			multipleChoiceTimer = setTimeout(() => {
				next();
			}, 600);
		}
	}, [choiceClicked]);

	useEffect(() => {
		if (isPreview || !isReviewing) checkfieldValidation(val);
	}, [attributes]);

	useEffect(() => {
		if (val?.length > 0) {
			setIsAnswered(true);
		} else {
			setIsAnswered(false);
		}
	}, [val, attributes]);

	return (
		<div className="qf-multiple-choice-block-renderer">
			<ChoicesWrapper
				attributes={attributes}
				id={id}
				val={val}
				isActive={isActive}
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
