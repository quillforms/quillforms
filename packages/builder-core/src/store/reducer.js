/* eslint-disable no-nested-ternary */
/**
 * Internal Dependencies
 */
import {
	SET_BLOCK_TITLE,
	SET_BLOCK_DESCRIPTION,
	SET_BLOCK_ATTRIBUTES,
	INSERT_NEW_FORM_BLOCK,
	REORDER_FORM_BLOCKS,
	DELETE_FORM_BLOCK,
	SET_CURRENT_BLOCK,
	TOGGLE_BLOCK_DESCRIPTION,
	SET_BLOCK_ATTACHMENT,
	TOGGLE_REQUIRED_FLAG,
	SETUP_STORE,
} from './constants';

/**
 * External dependencies
 */
import { reduce } from 'lodash';

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
 * Sort blocks. We should have welcome screens at first then fields then thankyou screens.
 *
 * @param {Object} blocks The blocks array.
 *
 * @return { Object } The sorted blocks
 */
function sortBlocks( blocks ) {
	const priority = [ 'WELCOME_SCREENS', 'FIELDS', 'THANKYOU_SCREENS' ];
	blocks.sort( ( a, b ) => {
		const getCategory = ( block ) => {
			switch ( block.type ) {
				case 'welcome-screen':
					return 'WELCOME_SCREENS';
				case 'thankyou-screen':
					return 'THANKYOU_SCREENS';
				default:
					return 'fields';
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
 * Reducer returning the form object.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
const FormReducer = ( state = initialState, action ) => {
	switch ( action.type ) {
		// SET UP STORE
		case SETUP_STORE: {
			const { initialPayload } = action.payload;
			const { blocks } = initialPayload;
			return blocks;
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
			const nextAttributes = reduce(
				attributes,
				( result, value, key ) => {
					if ( value !== result[ key ] ) {
						result = getMutateSafeObject(
							[ ...state.blocks ][ blockIndex ],
							result
						);
						result[ key ] = value;
					}

					return result;
				},
				state.blocks[ blockIndex ]
			);

			// Skip update if nothing has been changed. The reference will
			// match the original block if `reduce` had no changed values.
			if ( nextAttributes === state.blocks[ blockIndex ].attributes ) {
				console.log( 'This is true' );
				return state;
			}

			// Otherwise replace attributes in state
			const blocks = [ ...state.blocks ];
			blocks[ blockIndex ].attributes = { ...nextAttributes };
			return {
				...state,
				blocks,
			};
		}

		// REORDER FORM BLOCKS
		case REORDER_FORM_BLOCKS: {
			const { sourceIndex, destinationIndex } = action.payload;

			const blocks = [ ...state.blocks ];
			const result = Array.from( blocks );
			const [ removed ] = result.splice( sourceIndex, 1 );
			result.splice( destinationIndex, 0, removed );
			return {
				...state,
				blocks: sortBlocks( result ),
				currentBlockId: state.blocks[ sourceIndex ].id,
			};
		}

		// INSERT NEW FORM BLOCK
		case INSERT_NEW_FORM_BLOCK: {
			const { block, destination } = action.payload;
			const blocks = [ ...state.blocks ];
			const { index } = destination;

			blocks.splice( index, 0, {
				...block,
			} );
			return {
				...state,
				blocks: sortBlocks( blocks ),
				currentBlockId: block.id,
			};
		}

		// DELETE FORM BLOCK
		case DELETE_FORM_BLOCK: {
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
			if ( blockIndex === -1 ) {
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
};

export default FormReducer;
