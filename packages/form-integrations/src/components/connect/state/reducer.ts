/**
 * WordPress Dependencies
 */
import { combineReducers } from '@wordpress/data';

/**
 * External dependencies
 */
import type { Reducer } from 'redux';
import { mergeWith, isArray, omit } from 'lodash';

/**
 * Internal dependencies
 */
import {
	SETUP_APP,
	SETUP_ACCOUNTS,
	ADD_ACCOUNT,
	UPDATE_ACCOUNT,
	SETUP_CONNECTIONS,
	ADD_CONNECTION,
	UPDATE_CONNECTION,
	DELETE_CONNECTION,
} from './constants';
import type {
	App,
	Accounts,
	Connections,
	AppActionTypes,
	AccountsActionTypes,
	ConnectionsActionTypes,
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
const connections: Reducer< Connections, ConnectionsActionTypes > = (
	state = {},
	action
) => {
	switch ( action.type ) {
		case SETUP_CONNECTIONS: {
			if ( ! action.connections ) {
				return state;
			}
			return {
				...action.connections,
			};
		}

		case ADD_CONNECTION: {
			return {
				...state,
				[ action.id ]: action.connection,
			};
		}

		case UPDATE_CONNECTION: {
			if ( ! state?.[ action.id ] ) {
				return state;
			}
			let connection = { ...state[ action.id ] };
			if ( action.recursive ) {
				mergeWith( connection, action.connection, ( obj, src ) => {
					if ( isArray( obj ) ) return src;
				} );
			} else {
				// @ts-ignore
				connection = { ...connection, ...action.connection };
			}
			return {
				...state,
				[ action.id ]: connection,
			};
		}

		case DELETE_CONNECTION: {
			return omit( { ...state }, action.id );
		}
	}
	return state;
};

const CombinedReducer = combineReducers( {
	app,
	accounts,
	connections,
} );
export type State = ReturnType< typeof CombinedReducer >;
export default CombinedReducer;
