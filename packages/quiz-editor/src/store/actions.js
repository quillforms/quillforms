import { SETUP_STORE, SET_CORRECT_ANSWERS, TOGGLE_CORRECT_INCORRECT_QUIZ_MODE, SET_DISPLAY_ANSWER_STATE, SET_DISPLAY_EXPLANATION_STATE, SHOW_ANSWERS_DURING_QUIZ } from './constants';

export const setupStore = (initialState) => {
	return {
		type: 'SETUP_STORE',
		initialState,
	};
};


export const setCorrectAnswers = (answers) => {
	return {
		type: SET_CORRECT_ANSWERS,
		answers,
	};
};

export const toggleCorrectIncorrectQuizMode = (mode) => {
	return {
		type: TOGGLE_CORRECT_INCORRECT_QUIZ_MODE,
		mode,
	};
};


export const showAnswersDuringQuiz = (showAnswersDuringQuiz) => {
	return {
		type: SHOW_ANSWERS_DURING_QUIZ,
		showAnswersDuringQuiz,
	};
}




