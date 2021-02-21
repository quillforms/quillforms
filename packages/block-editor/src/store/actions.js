import {
	SETUP_STORE,
	SET_BLOCK_TITLE,
	SET_BLOCK_DESCRIPTION,
	SET_BLOCK_ATTRIBUTES,
	INSERT_BLOCK,
	DELETE_BLOCK,
	SET_CURRENT_BLOCK,
	REORDER_BLOCKS,
} from './constants';

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
 * Set block attributes
 *
 * @param {string} blockId  	 Block Id
 * @param {string} attributes    Block attributes
 *
 * @return {Object} Action object.
 */
export const setBlockAttributes = ( blockId, attributes ) => {
	return {
		type: SET_BLOCK_ATTRIBUTES,
		payload: { blockId, attributes },
	};
};

/**
 * Reorder form blocks
 *
 * @param {number} 	sourceIndex       Source index in the array
 * @param {number} 	destinationIndex  Destination index in the array
 *
 * @return {Object} Action object.
 */
export const reorderBlocks = ( sourceIndex, destinationIndex ) => {
	return {
		type: REORDER_BLOCKS,
		payload: { sourceIndex, destinationIndex },
	};
};

/**
 * Insert new form block
 *
 * @param {Object} block         Block object which holds the block definition
 * @param {Object} destination   Destination object
 *
 * @return {Object} Action object.
 */
export const insertBlock = ( block, destination ) => {
	return {
		type: INSERT_BLOCK,
		payload: { block, destination },
	};
};

/**
 * Set current block
 *
 * @param {string} id        Block uuid
 *
 * @return {Object} Action object.
 */
export const setCurrentBlock = ( id ) => {
	return {
		type: SET_CURRENT_BLOCK,
		payload: { id },
	};
};

/**
 * Delete current block
 *
 * @param {string} blockId   Block uuid
 *
 * @return {Object} Action object.
 */
export const deleteBlock = ( blockId ) => {
	return {
		type: DELETE_BLOCK,
		payload: { blockId },
	};
};
