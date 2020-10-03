import {
	SET_POST_ID,
	SET_HAS_UNSAVED_CHANGES,
	SET_IS_SAVING,
} from './constants';

/**
 * Set post id
 *
 * @param {boolean} postId post id.
 *
 * @return {Object} Action object.
 */
export const __experimentalSetPostId = ( postId ) => {
	return {
		type: SET_POST_ID,
		postId,
	};
};

/**
 * Set is saving flag
 *
 * @param {boolean} isSaving isSaving flag.
 *
 * @return {Object} Action object.
 */
export const setIsSaving = ( isSaving ) => {
	return {
		type: SET_IS_SAVING,
		isSaving,
	};
};

/**
 * Set has unsaved changes
 *
 * @param {boolean} hasUnsavedChanges hasUnsavedChanges flag.
 *
 * @return {Object} Action object.
 */
export const setHasUnsavedchanges = ( hasUnsavedChanges ) => {
	return {
		type: SET_HAS_UNSAVED_CHANGES,
		hasUnsavedChanges,
	};
};
