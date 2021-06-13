import {
	SETUP_STORE,
	SET_BLOCK_ATTRIBUTES,
	INSERT_BLOCK,
	DELETE_BLOCK,
	SET_CURRENT_BLOCK,
	REORDER_BLOCKS,
} from './constants';

import type {
	BlockEditorActionTypes,
	InitialPayload,
	DraggedBlockDestination,
} from './types';
import type { FormBlock } from '@quillforms/types';

/**
 * Set up the store.
 *
 * @param {InitialPayload} initialPayload Initial payload object.
 *
 * @return {BlockEditorActionTypes} Action object.
 */
export function setupStore(
	initialPayload: InitialPayload
): BlockEditorActionTypes {
	return {
		type: SETUP_STORE,
		initialPayload,
	};
}

/**
 * Set block attributes
 *
 * @param {string} blockId  	 Block Id
 * @param {Object} attributes    Block attributes
 *
 * @return {BlockEditorActionTypes} Action object.
 */
export const setBlockAttributes = (
	blockId: string,
	attributes: Record< string, unknown >
): BlockEditorActionTypes => {
	return {
		type: SET_BLOCK_ATTRIBUTES,
		blockId,
		attributes,
	};
};

/**
 * Reorder form blocks
 *
 * @param {number} 	sourceIndex       Source index in the array
 * @param {number} 	destinationIndex  Destination index in the array
 *
 * @return {BlockEditorActionTypes} Action object.
 */
export const __experimentalReorderBlocks = (
	sourceIndex: number,
	destinationIndex: number
): BlockEditorActionTypes => {
	return {
		type: REORDER_BLOCKS,
		sourceIndex,
		destinationIndex,
	};
};

/**
 * Insert new form block
 *
 * @param {FormBlock}               block         Block object which holds the block definition
 * @param {DraggedBlockDestination} destination   Destination object
 *
 * @return {BlockEditorActionTypes} Action object.
 */
export const __experimentalInsertBlock = (
	block: FormBlock,
	destination: DraggedBlockDestination
): BlockEditorActionTypes => {
	return {
		type: INSERT_BLOCK,
		block,
		destination,
	};
};

/**
 * Set current block
 *
 * @param {string} blockId        Block uuid
 *
 * @return {BlockEditorActionTypes} Action object.
 */
export const setCurrentBlock = ( blockId: string ): BlockEditorActionTypes => {
	return {
		type: SET_CURRENT_BLOCK,
		blockId,
	};
};

/**
 * Delete current block
 *
 * @param {string} blockId   Block uuid
 *
 * @return {BlockEditorActionTypes} Action object.
 */
export const deleteBlock = ( blockId: string ): BlockEditorActionTypes => {
	return {
		type: DELETE_BLOCK,
		blockId,
	};
};
