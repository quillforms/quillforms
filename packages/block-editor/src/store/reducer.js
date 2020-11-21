/* eslint-disable no-nested-ternary */
/**
 * External dependencies
 */
import {
	flow,
	reduce,
	first,
	last,
	omit,
	cloneDeep,
	mapValues,
	keys,
	isEqual,
	isEmpty,
	identity,
	difference,
	omitBy,
	pickBy,
} from 'lodash';

/**
 * Internal Dependencies
 */
import {
	SET_BLOCK_TITLE,
	SET_BLOCK_DESCRIPTION,
	SET_BLOCK_ATTRIBUTES,
	INSERT_BLOCK,
	REORDER_BLOCKS,
	DELETE_BLOCK,
	SET_CURRENT_BLOCK,
	TOGGLE_BLOCK_DESCRIPTION,
	SET_BLOCK_ATTACHMENT,
	TOGGLE_REQUIRED_FLAG,
	SETUP_STORE,
} from './constants';

/**
 * Returns an object against which it is safe to perform mutating operations,
 * given the original object and its current working copy.
 *
 * @param {Object} original Original object.
 * @param {Object} working  Working object.
 *
 * @return {Object} Mutation-safe object.
 */
function getMutateSafeObject( original, working ) {
	if ( original === working ) {
		return { ...original };
	}

	return working;
}

/**
 * Sort blocks. We should have welcome screens at first then others then thankyou screens.
 *
 * @param {Object} blocks The blocks array.
 *
 * @return { Object } The sorted blocks
 */
function sortBlocks( blocks ) {
	const priority = [ 'WELCOME_SCREENS', 'OTHERS', 'THANKYOU_SCREENS' ];
	blocks.sort( ( a, b ) => {
		const getCategory = ( block ) => {
			switch ( block.type ) {
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
const initialState = {
	currentBlockId: '',
	blocks: [],
};

/**
 * Helper method to iterate through all blocks, recursing into inner blocks,
 * applying a transformation function to each one.
 * Returns a flattened object with the transformed blocks.
 *
 * @param {Array} blocks Blocks to flatten.
 * @param {Function} transform Transforming function to be applied to each block.
 *
 * @return {Object} Flattened object.
 */
function flattenBlocks( blocks, transform = identity ) {
	const result = {};

	const stack = [ ...blocks ];
	while ( stack.length ) {
		const { ...block } = stack.shift();
		result[ block.clientId ] = transform( block );
	}

	return result;
}

/**
 * Utility returning an object with an empty object value for each key.
 *
 * @param {Array} objectKeys Keys to fill.
 * @return {Object} Object filled with empty object as values for each clientId.
 */
const fillKeysWithEmptyObject = ( objectKeys ) => {
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
const withBlockCache = ( reducer ) => ( state = {}, action ) => {
	const newState = reducer( state, action );

	if ( newState === state ) {
		return state;
	}
	newState.cache = state.cache ? state.cache : {};

	/**
	 * For each clientId provided, traverses up parents, adding the provided clientIds
	 * and each parent's clientId to the returned array.
	 *
	 * When calling this function consider that it uses the old state, so any state
	 * modifications made by the `reducer` will not be present.
	 *
	 * @param {Array} clientIds an Array of block clientIds.
	 *
	 * @return {Array} The provided clientIds and all of their parent clientIds.
	 */
	const getBlocksWithParentsClientIds = ( clientIds ) => {
		return clientIds.reduce( ( result, clientId ) => {
			let current = clientId;
			do {
				result.push( current );
				current = state.blocks[ current ];
			} while ( current );
			return result;
		}, [] );
	};

	switch ( action.type ) {
		case INSERT_BLOCK: {
			const updatedBlockUids = [];
			if ( action?.payload?.block?.id ) {
				updatedBlockUids.push( action.payload.block.id );
			}
			newState.cache = {
				...newState.cache,
				...fillKeysWithEmptyObject(
					getBlocksWithParentsClientIds( updatedBlockUids )
				),
			};
			break;
		}

		case DELETE_BLOCK: {
			return omit( state, action.payload.blockId );
		}
		case SET_BLOCK_TITLE:
		case SET_BLOCK_DESCRIPTION:
		case SET_BLOCK_ATTACHMENT:
		case TOGGLE_BLOCK_DESCRIPTION:
		case TOGGLE_REQUIRED_FLAG:
		case SET_BLOCK_ATTRIBUTES:
			newState.cache = {
				...newState.cache,
				...fillKeysWithEmptyObject(
					getBlocksWithParentsClientIds( [ action.payload.blockId ] )
				),
			};
			break;

		case REORDER_BLOCKS: {
			const updatedBlockUids = [];
			if ( action.payload.sourceIndex ) {
				updatedBlockUids.push(
					state.blocks[ action.payload.sourceIndex ].id
				);
			}
			if ( action.payload.destinationIndex ) {
				updatedBlockUids.push(
					state.blocks[ action.payload.destinationIndex ].id
				);
			}
			newState.cache = {
				...newState.cache,
				...fillKeysWithEmptyObject(
					getBlocksWithParentsClientIds( updatedBlockUids )
				),
			};
			break;
		}
	}
	return newState;
};
/**
 * Reducer returning the form object.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
const BlockEditorReducer = withBlockCache( ( state = initialState, action ) => {
	console.log( action );
	switch ( action.type ) {
		// SET UP STORE
		case SETUP_STORE: {
			const { initialPayload } = action.payload;
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

		// SET FORM BLOCK TITLE
		case SET_BLOCK_TITLE: {
			const { blockId, title } = action.payload;

			const blockIndex = state.blocks.findIndex( ( block ) => {
				return block.id === blockId;
			} );

			// Skip update if nothing has been changed.
			if ( title === state.blocks[ blockIndex ].title ) {
				return state;
			}
			const blocks = [ ...state.blocks ];
			blocks[ blockIndex ].title = title;
			return {
				...state,
				blocks,
			};
		}

		// SET FORM BLOCK DESCRIPTION
		case SET_BLOCK_DESCRIPTION: {
			const { blockId, desc } = action.payload;
			// Get block index within category.
			const blockIndex = state.blocks.findIndex( ( block ) => {
				return block.id === blockId;
			} );

			// Skip update if nothing has been changed.
			if ( desc === state.blocks[ blockIndex ].description ) {
				return state;
			}
			const blocks = [ ...state.blocks ];
			blocks[ blockIndex ].description = desc;
			return {
				...state,
				blocks,
			};
		}

		// SET BLOCK ATTRIBUTES
		case SET_BLOCK_ATTRIBUTES: {
			const { blockId, attributes } = action.payload;

			// Get block index within its category.
			const blockIndex = state.blocks.findIndex( ( block ) => {
				return block.id === blockId;
			} );

			// Ignore updates if block isn't known.
			if ( ! state.blocks[ blockIndex ] ) {
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
			const { sourceIndex, destinationIndex } = action.payload;

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
			const { block, destination } = action.payload;
			const blocks = [ ...state.blocks ];
			const { index } = destination;

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
			const { blockId } = action.payload;

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
				: null;
			return {
				...state,
				currentBlockId,
				blocks,
			};
		}

		// SET CURRENT BLOCK
		case SET_CURRENT_BLOCK: {
			const { id } = action.payload;
			const blockIndex = state.blocks.findIndex(
				( item ) => item.id === id
			);
			// If block isn't found.
			if ( blockIndex === -1 || id === state.currentBlockId ) {
				return state;
			}
			return {
				...state,
				currentBlockId: id,
			};
		}

		// TOGGLE BLOCK DESCRIPTION
		case TOGGLE_BLOCK_DESCRIPTION: {
			const { blockId } = action.payload;
			const blockIndex = state.blocks.findIndex( ( block ) => {
				return block.id === blockId;
			} );
			// If block isn't found.
			if ( blockIndex === -1 ) {
				return state;
			}
			const blocks = [ ...state.blocks ];
			if ( blocks[ blockIndex ].description ) {
				delete blocks[ blockIndex ].description;
			} else {
				blocks[ blockIndex ].description = '<p></p>';
			}
			return {
				...state,
				blocks,
			};
		}

		// SET BLOCK ATTACHMENT
		case SET_BLOCK_ATTACHMENT: {
			const { blockId, val } = action.payload;
			const blockIndex = state.blocks.findIndex( ( block ) => {
				return block.id === blockId;
			} );
			// If block isn't found.
			if ( blockIndex === -1 ) {
				return state;
			}
			const blocks = [ ...state.blocks ];
			blocks[ blockIndex ].attachment = val;
			return { ...state, blocks };
		}

		// TOGGLE REQUIRED FLAG
		case TOGGLE_REQUIRED_FLAG: {
			const { blockId } = action.payload;
			const blockIndex = state.blocks.findIndex( ( block ) => {
				return block.id === blockId;
			} );
			// If block isn't found.
			if ( blockIndex === -1 ) {
				return state;
			}
			const requiredFlag = state.blocks[ blockIndex ].required;
			const blocks = [ ...state.blocks ];
			blocks[ blockIndex ].required = ! requiredFlag;
			return {
				...state,
				blocks,
			};
		}
	}
	return state;
} );

export default BlockEditorReducer;
