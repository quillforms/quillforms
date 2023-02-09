import { SET_CUSTOM_CSS } from './constants';

/**
 * WordPress dependencies
 */
import { combineReducers } from '@wordpress/data';

/**
 * Reducer managing the post slug
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function customCSS( state = '', action ) {
	switch ( action.type ) {
		case SET_CUSTOM_CSS:
			return action.css;
	}

	return state;
}

export default combineReducers( { customCSS } );
