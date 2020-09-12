import {
	SETUP_STORE,
	SET_BLOCK_TITLE,
	SET_BLOCK_DESCRIPTION,
	SET_BLOCK_ATTRIBUTES,
	INSERT_NEW_FORM_BLOCK,
	DELETE_FORM_BLOCK,
	SET_CURRENT_BLOCK,
	TOGGLE_BLOCK_DESCRIPTION,
	SET_BLOCK_ATTACHMENT,
	REORDER_FORM_BLOCKS,
	TOGGLE_REQUIRED_FLAG,
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
 * Set block title
 *
 * @param {string}  blockId  Block uuid
 * @param {string}  title    Block title
 *
 * @return {Object} Action object.
 */
export const setBlockTitle = ( blockId, title ) => {
	return {
		type: SET_BLOCK_TITLE,
		payload: { blockId, title },
	};
};

/**
 * Set block description
 *
 * @param {string} blockId  Block uuid
 * @param {string} desc     Block description
 *
 * @return {Object} Action object.
 */
export const setBlockDesc = ( blockId, desc ) => {
	return {
		type: SET_BLOCK_DESCRIPTION,
		payload: { blockId, desc },
	};
};

/**
 * Set block attributes
 *
 * @param {string} blockId  	 Block uuid
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
export const reorderFormBlocks = ( sourceIndex, destinationIndex ) => {
	return {
		type: REORDER_FORM_BLOCKS,
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
export const insertNewFormBlock = ( block, destination ) => {
	return {
		type: INSERT_NEW_FORM_BLOCK,
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
export const deleteFormBlock = ( blockId ) => {
	return {
		type: DELETE_FORM_BLOCK,
		payload: { blockId },
	};
};

/**
 * Toggle block description
 *
 * @param {string} blockId   Block id
 *
 * @return {Object} Action object.
 */
export const toggleDescription = ( blockId ) => {
	return {
		type: TOGGLE_BLOCK_DESCRIPTION,
		payload: { blockId },
	};
};

/**
 * Set Block Attachment
 *
 * @param {string}  blockId   Block id
 * @param {Object}  val       Attachment object
 *
 * @return {Object} Action object.
 */
export const setBlockAttachment = ( blockId, val ) => {
	return {
		type: SET_BLOCK_ATTACHMENT,
		payload: { blockId, val },
	};
};

/**
 * Toogle Required Flag
 *
 * @param {string} blockId    Block id
 *
 * @return {Object} Action object
 */
export const toggleRequired = ( blockId ) => {
	return {
		type: TOGGLE_REQUIRED_FLAG,
		payload: { blockId },
	};
};
