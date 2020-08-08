import { SET_MESSAGE, SETUP_STORE } from './constants';

/**
 * Set up the store.
 *
 * @param {Object} initialPayload Initial payload object.
 *
 * @return {Object} Action object.
 */
export function setupStore( initialPayload ) {
	return {
		type: SETUP_STORE,
		payload: { initialPayload },
	};
}

/**
 * Set message for a specific key
 *
 * @param {string}   key  	 The message key
 * @param {string}   value   The message value
 *
 * @return {Object} Action object.
 */
export const setMessage = ( key, value ) => {
	return {
		type: SET_MESSAGE,
		payload: { key, value },
	};
};
