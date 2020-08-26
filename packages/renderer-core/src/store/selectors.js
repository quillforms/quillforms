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
 * Get current block category.
 *
 * @param {Object} state       Global application state.
 *
 * @return {string} Current block category.
 */
export function getCurrentBlockCat( state ) {
	return state.currentBlockCat;
}

/**
 * Is block changing.
 *
 * @param {Object} state      Global application state.
 *
 * @return {boolean} Is block changing.
 */
export function isBlockChanging( state ) {
	return state.isBlockChanging;
}

/**
 * Get animatiom effects
 *
 * @param {Object } state      Global application state.
 *
 * @return {Object} Animation effects.
 *
 */
export function getAnimationEffects( state ) {
	return state.animationEffects;
}
