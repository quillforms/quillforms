/**
 * Get the messages
 *
 * @param {Object} state       Global application state.
 *
 * @return {Object} Messages
 */
export function getMessages( state ) {
	return { ...state.messages };
}
