/**
 * Get post id.
 *
 * @param {Object} state       Global application state.
 *
 * @return {number} Post id
 */
export function getPostId( state ) {
	return state.postId;
}

/**
 * Has unsaved changes
 *
 * @param {Object} state       Global application state.
 *
 * @return {boolean} hasUnsavedChanges flag
 */
export function hasUnsavedChanges( state ) {
	return state.hasUnsavedChanges;
}

/**
 * Is saving
 *
 * @param {Object} state       Global application state.
 *
 * @return {boolean} isSaving flag
 */
export function isSaving( state ) {
	return state.isSaving;
}
