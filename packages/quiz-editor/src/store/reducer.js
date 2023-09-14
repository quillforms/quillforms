import {
	SETUP_STORE,
	SET_CORRECT_ANSWERS,
	SHOW_ANSWERS_DURING_QUIZ,
	TOGGLE_CORRECT_INCORRECT_QUIZ_MODE
} from "./constants"

const initialState = {
	enabled: false,
	questions: {},
	showAnswersDuringQuiz: true,
}

const quizEditorReducer = (state = initialState, action) => {
	switch (action.type) {

		case SETUP_STORE: {
			return {
				...state,
				...action.initialState
			}
		}
		case TOGGLE_CORRECT_INCORRECT_QUIZ_MODE: {
			return {
				...state,
				enabled: !state.enabled
			}
		}
		case SET_CORRECT_ANSWERS: {
			return {
				...state,
				questions: action.answers
			}
		}

		case SHOW_ANSWERS_DURING_QUIZ: {
			return {
				...state,
				showAnswersDuringQuiz: action.showAnswersDuringQuiz
			}
		}
	}

	return state;
}
export default quizEditorReducer;