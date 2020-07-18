/**
 * Returns notifications state object
 *
 * @param {Object} state     Global application state.
 *
 * @return {Object} Notifications State
 */
export function getNotificationsState( state ) {
	return state;
}

/**
 * Returns self notifications state
 *
 * @param {Object} state     Global application state.
 *
 * @return {Object} Self notifications state
 */
export function getSelfNotificationsState( state ) {
	return state.self;
}
