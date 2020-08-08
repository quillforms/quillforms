import { SET_MESSAGE, SETUP_STORE } from './constants';

const initialState = {
	messages: {},
};
/**
 * Reducer returning an array of registered blocks.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
const MessagesReducer = ( state = initialState, action ) => {
	switch ( action.type ) {
		// SET UP STORE
		case SETUP_STORE: {
			const { initialPayload } = action.payload;
			const stateClone = { messages: initialPayload };
			return stateClone;
		}
		// SET MESSAGE
		case SET_MESSAGE: {
			const { key, value } = action.payload;
			if ( state.messages[ key ] === value ) {
				return state;
			}
			const stateClone = { ...state };
			stateClone.messages = {
				...stateClone.messages,
				[ key ]: value,
			};
			return stateClone;
		}
	}
	return state;
};

export default MessagesReducer;
