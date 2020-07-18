import {
	SET_BLOCK_EDITOR_CONFIG,
	SET_BLOCK_RENDERER_CONFIG,
} from './constants';
import omit from 'lodash/omit';

const initialState = window.qfInitialPayload?.registeredBlocks
	? window.qfInitialPayload.registeredBlocks
	: {};

/**
 * Reducer returning an array of registered blocks.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
const BlocksReducer = ( state = initialState, action ) => {
	const stateClone = { ...state };
	switch ( action.type ) {
		case SET_BLOCK_EDITOR_CONFIG: {
			const { type } = action.payload;
			stateClone[ type ].editorConfig = {
				...omit( action.payload, [ 'type' ] ),
			};
			return stateClone;
		}
		case SET_BLOCK_RENDERER_CONFIG: {
			const { type } = action.payload;
			stateClone[ type ].rendererConfig = {
				...omit( action.payload, [ 'type' ] ),
			};
			return stateClone;
		}
	}
	return stateClone;
};

export default BlocksReducer;
