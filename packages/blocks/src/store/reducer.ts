/**
 * External dependencies
 */
import type { Reducer } from 'redux';
import { keyBy } from 'lodash';

/**
 * Internal Dependencies
 */
import {
	SET_BLOCK_ADMIN_SETTINGS,
	SET_BLOCK_RENDERER_SETTINGS,
	ADD_BLOCK_TYPES,
} from './constants';
import type { BlockActionTypes, BlocksState } from '../types';

const initialState: BlocksState = {
	unknown: {
		title: 'Unknown',
		supports: {
			editable: true,
			description: true,
			attachment: true,
			required: false,
			logic: true,
		},
		logicalOperators: [
			'is',
			'is_not',
			'starts_with',
			'greater_than',
			'lower_than',
			'ends_with',
			'contains',
			'not_contains',
		],
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
const BlocksReducer: Reducer< BlocksState, BlockActionTypes > = (
	state = initialState,
	action
): BlocksState => {
	switch ( action.type ) {
		case SET_BLOCK_ADMIN_SETTINGS:
		case SET_BLOCK_RENDERER_SETTINGS:
			const { name } = action;
			if ( ! state[ name ] ) {
				return state;
			}
			return {
				...state,
				[ name ]: {
					...state[ name ],
					...action.settings,
				},
			};
		case ADD_BLOCK_TYPES: {
			return {
				...state,
				...keyBy( action.blockTypes, 'name' ),
			};
		}
	}
	return state;
};

export type State = ReturnType< typeof BlocksReducer >;
export default BlocksReducer;
