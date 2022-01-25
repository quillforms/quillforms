import {
	DISABLE_PROGRESS_BAR,
	DISABLE_WHEEL_SWIPING,
	SETUP_STORE,
} from './constants';

/**
 * WordPress dependencies
 */
import { combineReducers } from '@wordpress/data';

/**
 * Disable progress bar reducer
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function disableProgressBar( state = false, action ) {
	switch ( action.type ) {
		case DISABLE_PROGRESS_BAR:
			return action.flag;

		case SETUP_STORE: {
			return action.initialPayload?.disableProgressBar
				? action.initialPayload?.disableProgressBar
				: false;
		}
	}

	return state;
}
/**
 * Disable Wheel swiping
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function disableWheelSwiping( state = false, action ) {
	switch ( action.type ) {
		case DISABLE_WHEEL_SWIPING:
			return action.flag;

		case SETUP_STORE: {
			return action.initialPayload?.disableWheelSwiping
				? action.initialPayload?.disableWheelSwiping
				: false;
		}
	}

	return state;
}

export default combineReducers( { disableProgressBar, disableWheelSwiping } );
