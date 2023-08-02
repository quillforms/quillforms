import { SET_CORRECT_ANSWERS, SHOW_CORRECT_ANSWER } from "./constants"

const initialState = {
	enabled: false,
	correctAnswers: {},
	showCorrectAnswer: false,
	showExplanation: false,
}

const quizEditorReducer = (state = initialState, action) => {
	switch (action.type) {
		case TOGGLE_MODE: {
			return {
				...state,
				enabled: !enabled

			}
		}
		case SET_CORRECT_ANSWERS: {
			return {
				...state,
				correctAnswers: action.answers
			}
		}

		case SHOW_CORRECT_ANSWER: {
			return {
				...state,
				showCorrectAnswer: action.flag
			}
		}
	}

	return state;
}
export default quizEditorReducer;