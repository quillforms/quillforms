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

// Initial State
const initialState = {
	currentBlockId: '',
	currentBlockCat: '',
	fields: [],
	welcomeScreens: [],
	thankyouScreens: [],
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
	const welcomeScreensLength = state.welcomeScreens.length;
	const thankyouScreensLength = state.thankyouScreens.length;
	const fieldsLength = state.fields.length;

	switch ( action.type ) {
		// SET UP STORE
		case SETUP_STORE: {
			const { initialPayload } = action.payload;
			const { welcomeScreens, fields, thankyouScreens } = initialPayload;
			const stateClone = { ...state };
			stateClone.welcomeScreens = welcomeScreens;
			stateClone.thankyouScreens = thankyouScreens;
			stateClone.fields = fields;
			return stateClone;
		}

		// SET FORM BLOCK TITLE
		case SET_BLOCK_TITLE: {
			const { blockId, title, blockCat } = action.payload;

			const blockIndex = state[ blockCat ].findIndex( ( block ) => {
				return block.id === blockId;
			} );

			// Skip update if nothing has been changed.
			if ( title === state[ blockCat ][ blockIndex ].title ) {
				return state;
			}

			const stateClone = { ...state };
			stateClone[ blockCat ][ blockIndex ].title = title;
			return stateClone;
		}

		// SET FORM BLOCK DESCRIPTION
		case SET_BLOCK_DESCRIPTION: {
			const { blockId, desc, blockCat } = action.payload;
			// Get block index within category.
			const blockIndex = state[ blockCat ].findIndex( ( block ) => {
				return block.id === blockId;
			} );

			// Skip update if nothing has been changed.
			if ( desc === state[ blockCat ][ blockIndex ].description ) {
				return state;
			}

			const stateClone = { ...state };
			stateClone[ blockCat ][ blockIndex ].description = desc;
			return stateClone;
		}

		// SET BLOCK ATTRIBUTES
		case SET_BLOCK_ATTRIBUTES: {
			const { blockId, attributes, blockCat } = action.payload;

			// Get block index within its category.
			const blockIndex = state[ blockCat ].findIndex( ( block ) => {
				return block.id === blockId;
			} );

			// Ignore updates if block isn't known.
			if ( ! state[ blockCat ][ blockIndex ] ) {
				return state;
			}

			// Consider as updates only changed values
			const nextAttributes = reduce(
				attributes,
				( result, value, key ) => {
					if ( value !== result[ key ] ) {
						result = getMutateSafeObject(
							state[ blockCat ][ blockIndex ].attributes,
							result
						);
						result[ key ] = value;
					}

					return result;
				},
				state[ blockCat ][ blockIndex ].attributes
			);

			// Skip update if nothing has been changed. The reference will
			// match the original block if `reduce` had no changed values.
			if (
				nextAttributes === state[ blockCat ][ blockIndex ].attributes
			) {
				return state;
			}

			// Otherwise replace attributes in state
			const stateClone = { ...state };
			stateClone[ blockCat ][ blockIndex ].attributes = nextAttributes;
			return stateClone;
		}

		// REORDER FORM BLOCKS
		case REORDER_FORM_BLOCKS: {
			let { sourceIndex, destinationIndex } = action.payload;
			let category = 'fields';

			// if welcome screen is dragged, skip update
			if ( sourceIndex < welcomeScreensLength ) {
				category = 'welcomeScreens';
				return state;
			}

			if ( sourceIndex >= welcomeScreensLength + fieldsLength ) {
				category = 'thankyouScreens';
			}
			sourceIndex =
				category === 'fields'
					? sourceIndex - welcomeScreensLength
					: sourceIndex - ( welcomeScreensLength + fieldsLength );
			destinationIndex =
				category === 'fields'
					? destinationIndex === 0
						? 0
						: destinationIndex - welcomeScreensLength
					: destinationIndex -
					  ( welcomeScreensLength + fieldsLength );

			const stateClone = { ...state };
			const catItems = [ ...stateClone[ category ] ];
			const result = Array.from( catItems );
			const [ removed ] = result.splice( sourceIndex, 1 );
			result.splice( destinationIndex, 0, removed );
			stateClone[ category ] = result;
			return stateClone;
		}

		// INSERT NEW FORM BLOCK
		case INSERT_NEW_FORM_BLOCK: {
			const { block, destination, category } = action.payload;
			const catItems = [ ...state[ category ] ];
			let { index } = destination;

			// if new field inserted after welcome screen
			if ( category === 'fields' && index > welcomeScreensLength - 1 ) {
				if (
					index <
					welcomeScreensLength + fieldsLength + thankyouScreensLength
				) {
					index = index - welcomeScreensLength;
				} else {
					index =
						index -
						( welcomeScreensLength + thankyouScreensLength );
				}
			}
			catItems.splice( index, 0, {
				...block,
			} );

			const stateClone = { ...state };
			stateClone[ category ] = catItems;
			stateClone.currentBlockId = block.id;
			stateClone.currentBlockCat = category;
			return stateClone;
		}

		// DELETE FORM BLOCK
		case DELETE_FORM_BLOCK: {
			const { blockId, blockCat } = action.payload;
			const allBlocks = state.welcomeScreens
				.concat( state.fields )
				.concat( state.thankyouScreens );
			// Get block index within its category
			const blockIndexWithinCat = state[ blockCat ].findIndex(
				( block ) => {
					return block.id === blockId;
				}
			);

			// If the block id isn't found
			if ( ! blockIndexWithinCat ) return state;

			const stateClone = { ...state };

			const catItems = [ ...state[ blockCat ] ];
			catItems.splice( blockIndexWithinCat, 1 );
			state[ blockCat ] = catItems;

			// Get block index within all categories after concatenating them.
			const blockIndexWithinAll = allBlocks.findIndex(
				( item ) => item.id === blockId
			);
			// If it is the only block
			if ( blockIndexWithinAll === 0 && allBlocks.length === 1 ) {
				stateClone.currentBlockId = null;
				stateClone.currentBlockCat = null;
			} else {
				// if it is the first block and has blocks after it
				let nextBlock = allBlocks[ blockIndexWithinAll + 1 ];

				// if it isn't the first block and has blocks before it
				if ( blockIndexWithinAll !== 0 ) {
					nextBlock = allBlocks[ blockIndexWithinAll - 1 ];
				}
				stateClone.currentBlockId = nextBlock.id;
				let nextBlockCat = 'fields';
				if (
					stateClone.welcomeScreens.some(
						( id ) => stateClone.currentBlockId === id
					)
				)
					nextBlockCat = 'welcomeScreens';
				else if (
					state.thankyouScreens.some(
						( id ) => stateClone.currentBlockId === id
					)
				)
					nextBlockCat = 'thankyouScreens';

				stateClone.currentBlockCat = nextBlockCat;
			}

			return stateClone;
		}

		// SET CURRENT BLOCK
		case SET_CURRENT_BLOCK: {
			const { id, category } = action.payload;
			const stateClone = { ...state };
			stateClone.currentBlockId = id;
			stateClone.currentBlockCat = category;
			return stateClone;
		}

		// TOGGLE BLOCK DESCRIPTION
		case TOGGLE_BLOCK_DESCRIPTION: {
			const { blockId, blockCat } = action.payload;
			const index = state[ blockCat ].findIndex( ( block ) => {
				return block.id === blockId;
			} );
			const stateClone = { ...state };
			if ( state[ blockCat ][ index ].description ) {
				delete stateClone[ blockCat ][ index ].description;
			} else {
				stateClone[ blockCat ][ index ].description = '<p></p>';
			}
			return stateClone;
		}

		// SET BLOCK ATTACHMENT
		case SET_BLOCK_ATTACHMENT: {
			const { blockId, val, blockCat } = action.payload;
			const index = state[ blockCat ].findIndex( ( block ) => {
				return block.id === blockId;
			} );
			const stateClone = { ...state };
			stateClone[ blockCat ][ index ].attachment = val;
			return stateClone;
		}

		// TOGGLE REQUIRED FLAG
		case TOGGLE_REQUIRED_FLAG: {
			const { blockId } = action.payload;
			const index = state.fields.findIndex( ( block ) => {
				return block.id === blockId;
			} );
			const requiredFlag = state.fields[ index ].required;
			const stateClone = { ...state };
			stateClone.fields[ index ].required = ! requiredFlag;
			return stateClone;
		}
	}
	return state;
};

export default FormReducer;
