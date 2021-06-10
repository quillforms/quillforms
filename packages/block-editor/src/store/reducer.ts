/* eslint-disable no-nested-ternary */
/**
 * External dependencies
 */
import { omit, cloneDeep, map } from 'lodash';
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
	SETUP_STORE,
} from './constants';
import type {
	BlockEditorActionTypes,
	BlockEditorState,
	BlockEditorPureState,
} from './types';
import type { FormBlocks } from '@quillforms/types';

/**
 * Sort blocks. We should have welcome screens at first then others then thankyou screens.
 *
 * @param {Object} blocks The blocks array.
 *
 * @return { Object } The sorted blocks
 */
function sortBlocks( blocks: FormBlocks ): FormBlocks {
	const priority = [ 'WELCOME_SCREENS', 'OTHERS', 'THANKYOU_SCREENS' ];
	blocks.sort( ( a, b ) => {
		const getCategory = ( block ) => {
			switch ( block.name ) {
				case 'welcome-screen':
					return 'WELCOME_SCREENS';
				case 'thankyou-screen':
					return 'THANKYOU_SCREENS';
				default:
					return 'OTHERS';
			}
		};

		const ap = priority.indexOf( getCategory( a ) );
		const bp = priority.indexOf( getCategory( b ) );
		return ap - bp;
	} );
	return blocks;
}

// Initial State
const initialState: BlockEditorPureState = {
	currentBlockId: undefined,
	blocks: [],
};

/**
 * Utility returning an object with an empty object value for each key.
 *
 * @param {string[]} objectKeys Keys to fill.
 * @return {Object} Object filled with empty object as values for each clientId.
 */
const fillKeysWithEmptyObject = (
	objectKeys: string[]
): Record< string, {} > => {
	return objectKeys.reduce( ( result, key ) => {
		result[ key ] = {};
		return result;
	}, {} );
};

/**
 *
/**
 * Higher-order reducer intended to compute a cache key for each block in the post.
 * A new instance of the cache key (empty object) is created each time the block object
 * needs to be refreshed (for any change in the block or its children).
 *
 * @param {Function} reducer Original reducer function.
 *
 * @return {Function} Enhanced reducer function.
 */
const withBlockCache = < T extends Reducer >(
	reducer: T
): Reducer< BlockEditorState, BlockEditorActionTypes > => (
	state = initialState,
	action
): BlockEditorState => {
	const newState: BlockEditorState = reducer( state, action );

	if ( newState === state ) {
		return state;
	}
	newState.cache = state.cache ? state.cache : {};

	switch ( action.type ) {
		case SETUP_STORE: {
			if ( action?.initialPayload?.length ) {
				const blockIds = map(
					action.initialPayload,
					( block ) => block.id
				);
				newState.cache = {
					...fillKeysWithEmptyObject( blockIds ),
				};
			}
			break;
		}
		case INSERT_BLOCK: {
			const updatedBlockIds: string[] = [];
			if ( action?.block?.id ) {
				updatedBlockIds.push( action.block.id );
			}
			newState.cache = {
				...newState.cache,
				...fillKeysWithEmptyObject( updatedBlockIds ),
			};
			break;
		}

		case DELETE_BLOCK: {
			newState.cache = {
				...omit( state.cache, action.blockId ),
			};
			break;
		}
		case SET_BLOCK_ATTRIBUTES:
			newState.cache = {
				...newState.cache,
				...fillKeysWithEmptyObject( [ action.blockId ] ),
			};
			break;

		case REORDER_BLOCKS: {
			const updatedBlockUids: string[] = [];
			if ( action.sourceIndex ) {
				updatedBlockUids.push( state.blocks[ action.sourceIndex ].id );
			}
			if ( action.destinationIndex ) {
				updatedBlockUids.push(
					state.blocks[ action.destinationIndex ].id
				);
			}
			newState.cache = {
				...newState.cache,
				...fillKeysWithEmptyObject( updatedBlockUids ),
			};
			break;
		}
	}
	return newState;
};

/**
 * Reducer returning the form object.
 *
 * @param {	BlockEditorPureState} state  Current state.
 * @param {BlockEditorActionTypes} action Dispatched action.
 *
 * @return {BlockEditorPureState} Updated state.
 */
const BlockEditorReducer: Reducer<
	BlockEditorPureState,
	BlockEditorActionTypes
> = ( state = initialState, action ): BlockEditorPureState => {
	switch ( action.type ) {
		// SET UP STORE
		case SETUP_STORE: {
			const { initialPayload } = action;
			if ( initialPayload.length > 0 && ! state.currentBlockId ) {
				return {
					blocks: initialPayload,
					currentBlockId: initialPayload[ 0 ].id,
				};
			}
			return {
				...state,
				blocks: initialPayload,
			};
		}

		// SET BLOCK ATTRIBUTES
		case SET_BLOCK_ATTRIBUTES: {
			const { blockId, attributes } = action;

			// Get block index within its category.
			const blockIndex = state.blocks.findIndex( ( block ) => {
				return block.id === blockId;
			} );

			// Ignore updates if block isn't known.
			if ( blockIndex === -1 ) {
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
				...cloneDeep( state.blocks[ blockIndex ].attributes ),
				...cloneDeep( attributes ),
			};

			// // Skip update if nothing has been changed. The reference will
			// // match the original block if `reduce` had no changed values.
			// if ( nextAttributes === state.blocks[ blockIndex ].attributes ) {
			// 	return state;
			// }

			// Otherwise replace attributes in state
			const blocks = [ ...state.blocks ];
			blocks[ blockIndex ] = {
				...blocks[ blockIndex ],
				attributes: { ...nextAttributes },
			};
			return {
				...state,
				blocks,
			};
		}

		// REORDER FORM BLOCKS
		case REORDER_BLOCKS: {
			const { sourceIndex, destinationIndex } = action;

			const blocks = [ ...state.blocks ];
			const result = Array.from( blocks );
			const [ removed ] = result.splice( sourceIndex, 1 );
			result.splice( destinationIndex, 0, removed );
			return {
				...state,
				blocks: sortBlocks( result ),
			};
		}

		// INSERT NEW FORM BLOCK
		case INSERT_BLOCK: {
			const { block, destination } = action;
			const blocks = [ ...state.blocks ];
			const { index } = destination;

			if ( index === undefined || index < 0 ) {
				return state;
			}
			blocks.splice( index, 0, {
				...block,
			} );
			return {
				blocks: sortBlocks( blocks ),
				currentBlockId: block.id,
			};
		}

		// DELETE FORM BLOCK
		case DELETE_BLOCK: {
			const { blockId } = action;

			// Get block index.
			const blockIndex = state.blocks.findIndex(
				( item ) => item.id === blockId
			);
			// If block isn't found.
			if ( blockIndex === -1 ) {
				return state;
			}
			const blocks = [ ...state.blocks ];

			const nextBlock = blocks[ blockIndex + 1 ];
			const prevBlock = blocks[ blockIndex - 1 ];
			blocks.splice( blockIndex, 1 );
			const currentBlockId = nextBlock
				? nextBlock.id
				: prevBlock
				? prevBlock.id
				: undefined;
			return {
				...state,
				currentBlockId,
				blocks,
			};
		}

		// SET CURRENT BLOCK
		case SET_CURRENT_BLOCK: {
			const { blockId } = action;
			const blockIndex = state.blocks.findIndex(
				( item ) => item.id === blockId
			);
			// If block isn't found.
			if ( blockIndex === -1 || blockId === state.currentBlockId ) {
				return state;
			}
			return {
				...state,
				currentBlockId: blockId,
			};
		}
	}
	return state;
};

const BlockEditorReducerWithHigherOrder = withBlockCache( BlockEditorReducer );

export type State = ReturnType< typeof BlockEditorReducerWithHigherOrder >;

export default BlockEditorReducerWithHigherOrder;
