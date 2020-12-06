/**
 * Get current block id.
 *
 * @param {Object} state       Global application state.
 *
 * @return {string} Current Block id.
 */
export function getCurrentBlockId( state ) {
	return state.currentBlockId;
}

/**
 * Get next block id.
 *
 * @param {Object} state       Global application state.
 *
 * @return {string} Next Block id.
 */
export function getNextBlockId( state ) {
	return state.nextBlockId;
}

/**
 * Get last active block id.
 *
 * @param {Object} state       Global application state.
 *
 * @return {string} Last active block id.
 */
export function getLastActiveBlockId( state ) {
	return state.lastActiveBlockId;
}

/**
 * Get previous block id.
 *
 * @param {Object} state       Global application state.
 *
 * @return {string} Previous Block id.
 */
export function getPreviousBlockId( state ) {
	return state.prevBlockId;
}

/**
 * Get current block id.
 *
 * @param {Object} state       Global application state.
 *
 * @return {Object} Current path.
 */
export function getCurrentPath( state ) {
	return state.currentPath;
}
