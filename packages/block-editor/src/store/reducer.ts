/* eslint-disable no-nested-ternary */
/**
 * External dependencies
 */
import { cloneDeep, identity, forEach } from 'lodash';
import type { Reducer } from 'redux';

/**
 * Internal Dependencies
 */
import {
	SET_BLOCK_ATTRIBUTES,
	INSERT_BLOCK,
	REORDER_BLOCKS,
	DELETE_BLOCK,
	SET_CURRENT_BLOCK,
	SET_CURRENT_CHILD_BLOCK,
	SETUP_STORE,
} from './constants';
import type { BlockEditorActionTypes, BlockEditorPureState } from './types';
import type { FormBlocks, FormBlock } from '@quillforms/types';

/**
 * Sort blocks. We should have welcome screens at first then others then thankyou screens.
 *
 * @param {Object} blocks The blocks array.
 *
 * @return { Object } The sorted blocks
 */
function sortBlocks(blocks: FormBlocks): FormBlocks {
	const priority = ['WELCOME_SCREENS', 'OTHERS', 'THANKYOU_SCREENS'];
	blocks.sort((a, b) => {
		const getCategory = (block) => {
			switch (block.name) {
				case 'welcome-screen':
					return 'WELCOME_SCREENS';
				case 'thankyou-screen':
					return 'THANKYOU_SCREENS';
				default:
					return 'OTHERS';
			}
		};

		const ap = priority.indexOf(getCategory(a));
		const bp = priority.indexOf(getCategory(b));
		return ap - bp;
	});
	return blocks;
}

// Initial State
const initialState: BlockEditorPureState = {
	currentBlockId: undefined,
	currentChildBlockId: undefined,
	blocks: [],
};

// /**
//  * Utility returning an object with an empty object value for each key.
//  *
//  * @param {string[]} objectKeys Keys to fill.
//  * @return {Object} Object filled with empty object as values for each clientId.
//  */
// const fillKeysWithEmptyObject = (
// 	objectKeys: string[]
// ): Record< string, {} > => {
// 	return objectKeys.reduce( ( result, key ) => {
// 		result[ key ] = {};
// 		return result;
// 	}, {} );
// };

/**
 * Helper method to iterate through all blocks, recursing into inner blocks,
 * applying a transformation function to each one.
 * Returns a flattened object with the transformed blocks.
 *
 * @param {FormBlocks} blocks    Blocks to flatten.
 *
 * @param              transform
 * @return {Array} Flattened object.
 */
export function flattenBlocks(
	blocks: FormBlocks,
	transform = identity
): FormBlocks {
	const result = [];

	const stack = [...blocks];
	while (stack.length) {
		// @ts-expect-error
		const { innerBlocks, ...block } = stack.shift();
		if (innerBlocks) {
			forEach(innerBlocks, ($block, index) => {
				innerBlocks[index] = {
					...$block,
					parentId: block.id,
				};
			});
			stack.push(...innerBlocks);
		}
		result[block.id] = transform(block);
	}

	return result;
}

/**
 * Reducer returning the form object.
 *
 * @param {	BlockEditorPureState}  state  Current state.
 * @param {BlockEditorActionTypes} action Dispatched action.
 *
 * @return {BlockEditorPureState} Updated state.
 */
const BlockEditorReducer: Reducer<
	BlockEditorPureState,
	BlockEditorActionTypes
> = (state = initialState, action): BlockEditorPureState => {
	switch (action.type) {
		// SET UP STORE
		case SETUP_STORE: {
			const { initialPayload } = action;
			if (initialPayload.length > 0 && !state.currentBlockId) {
				return {
					blocks: initialPayload,
					currentBlockId: initialPayload[0].id,
					currentChildBlockId: undefined,
				};
			}
			return {
				...state,
				blocks: initialPayload,
			};
		}

		// SET BLOCK ATTRIBUTES
		case SET_BLOCK_ATTRIBUTES: {
			const { blockId, attributes, parentId } = action;
			let parentIndex;
			// Get block index within its category.
			let $blocks = [...state.blocks] as FormBlocks | undefined;
			if (!$blocks) {
				return state;
			}
			if (typeof parentId !== 'undefined') {
				parentIndex = $blocks.findIndex((block) => {
					return block.id === parentId;
				});
				$blocks = [...state.blocks][parentIndex]?.innerBlocks;
			}
			if (!$blocks) {
				return state;
			}

			const blockIndex = $blocks.findIndex((block) => {
				return block.id === blockId;
			});

			// Ignore updates if block isn't known.
			if (blockIndex === -1) {
				return state;
			}

			// Consider as updates only changed values
			// const nextAttributes = reduce(
			// 	{ ...attributes },
			// 	( result, value, key ) => {
			// 		if ( value !== result[ key ] ) {
			// 			result = getMutateSafeObject(
			// 				state.blocks[ blockIndex ],
			// 				result
			// 			);
			// 			result[ key ] = value;
			// 		}

			// 		return result;
			// 	},
			// 	state.blocks[ blockIndex ].attributes
			// );
			const nextAttributes = {
				...cloneDeep($blocks[blockIndex].attributes),
				...cloneDeep(attributes),
			};
			// // Skip update if nothing has been changed. The reference will
			// // match the original block if `reduce` had no changed values.
			// if ( nextAttributes === state.blocks[ blockIndex ].attributes ) {
			// 	return state;
			// }
			$blocks[blockIndex].attributes = nextAttributes;

			const blocks = [...state.blocks];
			if (typeof parentIndex !== 'undefined') {
				blocks[parentIndex].innerBlocks = $blocks;
				$blocks = blocks;
			}
			return {
				...state,
				blocks: $blocks,
			};
		}
		case REORDER_BLOCKS: {
			const {
				sourceIndex,
				destinationIndex,
				parentSourceIndex,
				parentDestIndex,
			} = action;

			// Create deep copy of blocks
			const newBlocks = JSON.parse(JSON.stringify(state.blocks));

			// Get source block and remove it from original position
			let sourceBlock;

			if (typeof parentSourceIndex === 'undefined') {
				sourceBlock = { ...newBlocks[sourceIndex] };
				newBlocks.splice(sourceIndex, 1);
			} else {
				sourceBlock = { ...newBlocks[parentSourceIndex].innerBlocks[sourceIndex] };
				newBlocks[parentSourceIndex].innerBlocks.splice(sourceIndex, 1);
			}

			// Insert block at new position
			if (typeof parentDestIndex === 'undefined') {
				// Insert at root level
				newBlocks.splice(destinationIndex, 0, sourceBlock);
			} else {
				// Insert into group
				if (!newBlocks[parentDestIndex].innerBlocks) {
					newBlocks[parentDestIndex].innerBlocks = [];
				}
				newBlocks[parentDestIndex].innerBlocks.splice(destinationIndex, 0, sourceBlock);
			}

			return {
				...state,
				blocks: newBlocks,
			};
		}

		// INSERT NEW FORM BLOCK
		case INSERT_BLOCK: {
			const { block, destinationIndex, parent } = action;
			const blocks = [...state.blocks];
			const index = destinationIndex;
			let parentBlock = undefined as FormBlock | undefined;

			if (index === undefined || index < 0) {
				return state;
			}
			if (!parent) {
				blocks.splice(index, 0, {
					...block,
				});
			} else {
				const parentIndex = blocks.findIndex(
					($block) => $block.id === parent
				);
				parentBlock = blocks[parentIndex];
				if (!blocks[parentIndex].innerBlocks) {
					blocks[parentIndex].innerBlocks = [];
				}
				blocks[parentIndex]?.innerBlocks?.splice(index, 0, {
					...block,
				});
			}
			return {
				blocks: sortBlocks(blocks),
				currentBlockId: parentBlock ? parentBlock.id : block.id,
				currentChildBlockId: parentBlock ? block.id : undefined,
			};
		}

		// DELETE FORM BLOCK
		case DELETE_BLOCK: {
			const { blockId, parentId } = action;
			const originalBlocks = [...state.blocks];
			let parentIndex;
			let blocks = originalBlocks;
			if (!blocks) {
				return state;
			}
			if (typeof parentId !== 'undefined') {
				parentIndex = blocks.findIndex(
					(item) => item.id === parentId
				);
				if (blocks)
					blocks = blocks?.[parentIndex]?.innerBlocks ?? [];
			}
			// Get block index.
			const blockIndex = blocks.findIndex(
				(item) => item.id === blockId
			);
			// If block isn't found.
			if (blockIndex === -1) {
				return state;
			}

			const nextBlock = blocks[blockIndex + 1];
			const prevBlock = blocks[blockIndex - 1];
			blocks.splice(blockIndex, 1);
			const newCurrentBlockId = nextBlock
				? nextBlock.id
				: prevBlock
					? prevBlock.id
					: undefined;

			if (typeof parentIndex !== 'undefined') {
				const $blocks = originalBlocks;
				$blocks[parentIndex].innerBlocks = blocks;

				blocks = $blocks;
			}

			const newState = {
				...state,
				currentBlockId:
					typeof parentIndex === 'undefined'
						? newCurrentBlockId
						: state.currentBlockId,
				currentChildBlockId:
					typeof parentIndex === 'undefined'
						? undefined
						: newCurrentBlockId,
				blocks,
			};
			return newState;
		}

		// SET CURRENT BLOCK
		case SET_CURRENT_BLOCK: {
			const { blockId } = action;
			const blockIndex = state.blocks.findIndex(
				(item) => item.id === blockId
			);
			// If block isn't found.
			if (blockIndex === -1) {
				return state;
			}
			return {
				...state,
				currentBlockId: blockId,
				currentChildBlockId: undefined,
			};
		}

		// SET CURRENT CHILD BLOCK
		case SET_CURRENT_CHILD_BLOCK: {
			const { blockId } = action;
			// const parentblockIndex = state.blocks.findIndex(
			// 	( item ) => item.id === state.currentBlockId
			// );
			// // If block isn't found.
			// if (
			// 	parentblockIndex === -1 ||
			// 	typeof parentblockIndex === 'undefined' ||
			// 	state.blocks.length === 0 ||
			// 	! state.blocks[ parentblockIndex ]
			// ) {
			// 	return state;
			// }
			// const childBlockIndex = state.blocks[
			// 	parentblockIndex
			// ]?.innerBlocks?.findIndex(
			// 	( item ) => item.id === state.currentBlockId
			// );

			// if ( childBlockIndex === -1 ) {
			// 	return state;
			// }
			return {
				...state,
				currentChildBlockId: blockId,
			};
		}
	}
	return state;
};

const BlockEditorReducerWithHigherOrder = BlockEditorReducer;

export type State = ReturnType<typeof BlockEditorReducerWithHigherOrder>;

export default BlockEditorReducerWithHigherOrder;
