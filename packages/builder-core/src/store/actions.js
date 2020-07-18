import {
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
 * Set block title
 *
 * @param {string}                                            blockId  Block uuid
 * @param {string}                                            title    Block title
 * @param {("fields" | "welcomeScreens" | "thankyouScreens")} blockCat Block category
 *
 * @return {Object} Action object.
 */
export const setBlockTitle = ( blockId, title, blockCat ) => {
	return {
		type: SET_BLOCK_TITLE,
		payload: { blockId, title, blockCat },
	};
};

/**
 * Set block description
 *
 * @param {string}                                            blockId  Block uuid
 * @param {string}                                            desc     Block description
 * @param {("fields" | "welcomeScreens" | "thankyouScreens")} blockCat Block category
 *
 * @return {Object} Action object.
 */
export const setBlockDesc = ( blockId, desc, blockCat ) => {
	return {
		type: SET_BLOCK_DESCRIPTION,
		payload: { blockId, desc, blockCat },
	};
};

/**
 * Set block attributes
 *
 * @param {string}                                            blockId  	 Block uuid
 * @param {string}                                            attributes Block attributes
 * @param {("fields" | "welcomeScreens" | "thankyouScreens")} blockCat   Block category
 *
 * @return {Object} Action object.
 */
export const setBlockAttributes = ( blockId, attributes, blockCat ) => {
	return {
		type: SET_BLOCK_ATTRIBUTES,
		payload: { blockId, attributes, blockCat },
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
 * @param {Object}                                              block         Block object which holds the block definition
 * @param {Object}                                              destination   Destination object
 * @param {("fields" | "welcomeScreens" | "thankyouScreens")}   category      Block category
 *
 * @return {Object} Action object.
 */
export const insertNewFormBlock = ( block, destination, category ) => {
	return {
		type: INSERT_NEW_FORM_BLOCK,
		payload: { block, destination, category },
	};
};

/**
 * Set current block
 *
 * @param {string}                                              id        Block uuid
 * @param {("fields" | "welcomeScreens" | "thankyouScreens")} category  Block category
 *
 * @return {Object} Action object.
 */
export const setCurrentBlock = ( id, category ) => {
	return {
		type: SET_CURRENT_BLOCK,
		payload: { id, category },
	};
};

/**
 * Delete current block
 *
 * @param {string}                                            blockId   Block uuid
 * @param {("fields" | "welcomeScreens" | "thankyouScreens")} blockCat  Block category
 *
 * @return {Object} Action object.
 */
export const deleteFormBlock = ( blockId, blockCat ) => {
	return {
		type: DELETE_FORM_BLOCK,
		payload: { blockId, blockCat },
	};
};

/**
 * Toggle block description
 *
 * @param {string}                                            blockId   Block id
 * @param {("fields" | "welcomeScreens" | "thankyouScreens")} blockCat  Block category
 *
 * @return {Object} Action object.
 */
export const toggleDescription = ( blockId, blockCat ) => {
	return {
		type: TOGGLE_BLOCK_DESCRIPTION,
		payload: { blockId, blockCat },
	};
};

/**
 * Set Block Attachment
 *
 * @param {string}                                              blockId   Block id
 * @param {Object}                                              val       Attachment object
 * @param {("fields" | "welcomeScreens" | "thankyouScreens")}   blockCat  Block category
 *
 * @return {Object} Action object.
 */
export const setBlockAttachment = ( blockId, val, blockCat ) => {
	return {
		type: SET_BLOCK_ATTACHMENT,
		payload: { blockId, val, blockCat },
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
