import {
	SET_CURRENT_BLOCK_ID,
	SET_CURRENT_PATH,
	SET_NEXT_BLOCK_ID,
	SET_LAST_ACTIVE_BLOCK_ID,
	SET_PREV_BLOCK_ID,
} from './constants';

/**
 * Returns an action object used in setting current block id
 *
 * @param {string}   id  Block id
 *
 * @return {Object} Action object.
 */
export const setCurrentBlockId = ( id ) => {
	return {
		type: SET_CURRENT_BLOCK_ID,
		payload: { id },
	};
};

/**
 * Returns an action object used in setting next block id
 *
 * @param {string}   id  Block id
 *
 * @return {Object} Action object.
 */
export const setNextBlockId = ( id ) => {
	return {
		type: SET_NEXT_BLOCK_ID,
		payload: { id },
	};
};

/**
 * Returns an action object used in setting previous block id
 *
 * @param {string}   id  Block id
 *
 * @return {Object} Action object.
 */
export const setPrevBlockId = ( id ) => {
	return {
		type: SET_PREV_BLOCK_ID,
		payload: { id },
	};
};

/**
 * Returns an action object used in setting current path
 *
 * @param {Object}   path  path
 *
 * @return {Object} Action object.
 */
export const setCurrentPath = ( path ) => {
	return {
		type: SET_CURRENT_PATH,
		payload: { path },
	};
};

export const setLastActiveBlockId = ( id ) => {
	return {
		type: SET_LAST_ACTIVE_BLOCK_ID,
		payload: { id },
	};
};
