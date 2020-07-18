/**
 * Get all answers.
 *
 * @param {Object} state       Global application state.
 *
 * @return {Array} Registered blocks
 */
export function getAnswers( state ) {
	return [ ...state.answersList ];
}
