/**
 * Internal Dependencies
 */
import {
	SET_CURRENT_BLOCK_ID,
	SET_CURRENT_PATH,
	SET_LAST_ACTIVE_BLOCK_ID,
	SET_NEXT_BLOCK_ID,
	SET_PREV_BLOCK_ID,
} from './constants';

const initialState = {
	currentPath: {},
	currentBlockId: '',
	nextBlockId: '',
	prevBlockId: '',
	lastActiveBlockId: '',
};

const RendererCoreReducer = ( state = initialState, action ) => {
	switch ( action.type ) {
		case SET_CURRENT_BLOCK_ID: {
			const { id } = action.payload;
			if ( id === state.currentBlockId ) {
				return state;
			}
			return { ...state, currentBlockId: id };
		}

		case SET_NEXT_BLOCK_ID: {
			const { id } = action.payload;
			if ( id === state.nextBlockId ) {
				return state;
			}
			return { ...state, nextBlockId: id };
		}

		case SET_PREV_BLOCK_ID: {
			const { id } = action.payload;
			if ( id === state.prevBlockId ) {
				return state;
			}
			return { ...state, prevBlockId: id };
		}

		case SET_LAST_ACTIVE_BLOCK_ID: {
			const { id } = action.payload;
			if ( id === state.lastActiveBlockId ) {
				return state;
			}
			return { ...state, lastActiveBlockId: id };
		}

		case SET_CURRENT_PATH: {
			const { path } = action.payload;
			return {
				...state,
				currentPath: path,
			};
		}
	}
	return state;
};

export default RendererCoreReducer;
