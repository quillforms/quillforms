import { SET_CORRECT_ANSWERS, SET_CORRECT_INCORRECT_QUIZ_MODE, } from './constants';
export const setCorrectAnswers = (answers) => {
	return {
		type: SET_CORRECT_ANSWERS,
		answers,
	};
};


