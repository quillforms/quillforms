import {
	SET_BLOCK_ADMIN_SETTINGS,
	SET_BLOCK_RENDERER_SETTINGS,
	ADD_BLOCK_TYPES,
} from './constants';
import { omit, keyBy } from 'lodash';

const initialState = {
	unknown: {
		title: 'Unknown',
		supports: {
			editable: true,
			description: true,
			attachment: true,
			required: false,
			logic: true,
			logicalOperators: [
				'is',
				'is_not',
				'starts_with',
				'ends_with',
				'contains',
				'not_contains',
			],
		},
	},
};

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
		case SET_BLOCK_ADMIN_SETTINGS:
		case SET_BLOCK_RENDERER_SETTINGS:
			const { name } = action.settings;
			if ( ! state[ name ] ) {
				return state;
			}
			const stateClone = { ...state };
			stateClone[ name ] = {
				...stateClone[ name ],
				...omit( action.settings, [ 'name' ] ),
			};
			return stateClone;

		case ADD_BLOCK_TYPES: {
			return {
				...state,
				...keyBy( action.blockTypes, 'name' ),
			};
		}
	}
	return state;
};

export default BlocksReducer;
