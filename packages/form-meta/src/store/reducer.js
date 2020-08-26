/**
 * External Dependencies
 */
import { keyBy } from 'lodash';
/**
 * Internal Dependencies
 */
import { REGISTER_FORM_META } from './constants';

const initialState = {
	meta: {},
};

/**
 * Reducer returning the form meta state.
 * Just like the post meta, the form meta is any additonal data that should be saved in post meta.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
const MetaReducer = ( state = initialState, action ) => {
	switch ( action.type ) {
		// REGISTER_FORM_META
		case REGISTER_FORM_META: {
			return {
				...state,
				...keyBy( action.settings, 'name' ),
			};
		}
	}
	return state;
};

export default MetaReducer;
