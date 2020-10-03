/* eslint-disable no-nested-ternary */

/**
 * Internal Dependencies
 */
import {
	SET_POST_ID,
	SET_HAS_UNSAVED_CHANGES,
	SET_IS_SAVING,
} from './constants';

// Initial State
const initialState = {
	hasUnsavedChanges: false,
	postId: '',
	isSaving: false,
};

/**
 * Reducer returning the form object.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
const BuilderCoreReducer = ( state = initialState, action ) => {
	switch ( action.type ) {
		case SET_POST_ID: {
			return {
				...state,
				postId: action.postId,
			};
		}

		case SET_IS_SAVING: {
			if ( action.isSaving === state.isSaving ) {
				return state;
			}
			return {
				...state,
				isSaving: action.isSaving,
			};
		}

		case SET_HAS_UNSAVED_CHANGES: {
			if ( action.hasUnsavedChanges === state.hasUnsavedChanges ) {
				return state;
			}
			return {
				...state,
				hasUnsavedChanges: action.hasUnsavedChanges,
			};
		}
	}
	return state;
};

export default BuilderCoreReducer;
