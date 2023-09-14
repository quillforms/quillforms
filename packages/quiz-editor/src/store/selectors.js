export function getState(state) {
	return state;
}

export function getCorrectAnswers(state) {
	return state.questions;
}

export function isEnabled(state) {
	return state.enabled;
}

export function displayAnswersDuringQuiz(state) {
	return state.showAnswersDuringQuiz;
}
