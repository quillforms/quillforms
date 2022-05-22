/**
 * WordPress Dependencies
 */
import { combineReducers } from '@wordpress/data';

/**
 * External dependencies
 */
import type { Reducer } from 'redux';
import { omit } from 'lodash';

/**
 * Internal dependencies
 */
import {
	SETUP_APP,
	SETUP_ACCOUNTS,
	ADD_ACCOUNT,
	UPDATE_ACCOUNT,
	DELETE_ACCOUNT,
} from './constants';
import type {
	App,
	Accounts,
	AppActionTypes,
	AccountsActionTypes,
} from './types';

/**
 * Reducer returning the state.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
const app: Reducer< App, AppActionTypes > = ( state = {}, action ) => {
	switch ( action.type ) {
		case SETUP_APP: {
			if ( ! action.app ) {
				return state;
			}
			return {
				...action.app,
			};
		}
	}
	return state;
};

/**
 * Reducer returning the state.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
const accounts: Reducer< Accounts, AccountsActionTypes > = (
	state = {},
	action
) => {
	switch ( action.type ) {
		case SETUP_ACCOUNTS: {
			if ( ! action.accounts ) {
				return state;
			}
			return {
				...action.accounts,
			};
		}

		case ADD_ACCOUNT: {
			return {
				...state,
				[ action.id ]: action.account,
			};
		}

		case UPDATE_ACCOUNT: {
			if ( ! state?.[ action.id ] ) {
				return state;
			}
			return {
				...state,
				[ action.id ]: {
					...state[ action.id ],
					...action.account,
				},
			};
		}

		case DELETE_ACCOUNT: {
			return omit( { ...state }, action.id );
		}
	}
	return state;
};

const CombinedReducer = combineReducers( {
	app,
	accounts,
} );
export type State = ReturnType< typeof CombinedReducer >;
export default CombinedReducer;
