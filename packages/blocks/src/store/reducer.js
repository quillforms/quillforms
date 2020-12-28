import {
	SET_BLOCK_ADMIN_SETTINGS,
	SET_BLOCK_RENDERER_SETTINGS,
	REGISTER_SERVER_SIDE_BLOCKS,
} from './constants';
import omit from 'lodash/omit';

const initialState = {};

/**
 * Reducer returning an array of registered blocks.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
const BlocksReducer = ( state = initialState, action ) => {
	switch ( action.type ) {
		case SET_BLOCK_ADMIN_SETTINGS: {
			const { type } = action.payload;
			const stateClone = { ...state };
			stateClone[ type ].editorConfig = {
				...omit( action.payload, [ 'type' ] ),
			};
			return stateClone;
		}
		case SET_BLOCK_RENDERER_SETTINGS: {
			const { type } = action.payload;
			const stateClone = { ...state };
			stateClone[ type ].rendererConfig = {
				...omit( action.payload, [ 'type' ] ),
			};
			return stateClone;
		}
		case REGISTER_SERVER_SIDE_BLOCKS: {
			const { blocks } = action.payload;
			console.log(blocks);
			return blocks;
		}
	}
	return state;
};

export default BlocksReducer;
