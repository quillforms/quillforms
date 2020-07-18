import { SET_MESSAGE } from './constants';

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
