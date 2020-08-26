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

/**
 * Get count of answered fields.
 *
 * @param {Object} state
 *
 * @return {number} Answered fields count
 */
export function getAnsweredFieldsLength( state ) {
	return state.answersList.filter( ( answer ) => answer.isAnswered === true )
		.length;
}

/**
 * Get field answer value.
 *
 * @param {Object} state   Global application state.
 * @param {string} id 	   Field id.
 *
 * @return {any} Field answer value
 */
export function getFieldAnswerVal( state, id ) {
	const index = state.answersList.findIndex( ( answer ) => answer.id === id );
	return state.answersList[ index ].value;
}

/**
 * Is valid field.
 *
 * @param {Object} state   Global application state.
 * @param {string} id      Field id.
 *
 * @return {boolean} showErr flag
 */
export function isValidField( state, id ) {
	const index = state.answersList.findIndex( ( answer ) => answer.id === id );
	return state.answersList[ index ].isValid;
}
/**
 * Get field show error flag.
 *
 * @param {Object} state   Global application state.
 * @param {string} id      Field id.
 *
 * @return {boolean} showErr flag
 */
export function getShowErrFlag( state, id ) {
	const index = state.answersList.findIndex( ( answer ) => answer.id === id );
	return state.answersList[ index ].showErr;
}

/**
 * Get error message key flag.
 *
 * @param {Object} state   Global application state.
 * @param {string} id      Field id.
 *
 * @return {string} Error message key
 */
export function getErrMsgKeyFlag( state, id ) {
	const index = state.answersList.findIndex( ( answer ) => answer.id === id );
	return state.answersList[ index ].errorMsgKey;
}
