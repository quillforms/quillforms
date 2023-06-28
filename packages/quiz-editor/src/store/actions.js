import { SET_CORRECT_ANSWERS } from './constants';
export const setCorrectAnswers = (answers) => {
	return {
		type: SET_CORRECT_ANSWERS,
		answers,
	};
};
