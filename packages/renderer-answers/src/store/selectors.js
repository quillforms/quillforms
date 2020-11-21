/**
 * Get all answers.
 *
 * @param {Object} state       Global application state.
 *
 * @return {Array} Registered blocks
 */
export function getAnswers( state ) {
	return state.answers;
}

/**
 * Get count of answered fields.
 *
 * @param {Object} state
 *
 * @return {number} Answered fields count
 */
export function getAnsweredFieldsLength( state ) {
	return state.answers.filter( ( answer ) => answer.isAnswered === true )
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
	const index = state.answers.findIndex( ( answer ) => answer.id === id );
	return state.answers[ index ].value;
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
	const index = state.answers.findIndex( ( answer ) => answer.id === id );
	return state.answers[ index ].isValid;
}

/**
 * Get field validation error message.
 *
 * @param {Object} state   Global application state.
 * @param {string} id      Field id.
 *
 * @return {string} Field validation error message
 */
export function getFieldValidationErr( state, id ) {
	const index = state.answers.findIndex( ( answer ) => answer.id === id );
	return state.answers[ index ].validationErr;
}
