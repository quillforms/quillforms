/**
 * WordPress Dependencies
 */
import { combineReducers } from '@wordpress/data';

/**
 * External dependencies
 */
import { mergeWith, isArray, omit } from 'lodash';

/**
 * Internal dependencies
 */
import {
	SET_ENABLED,
	ADD_MODEL,
	UPDATE_MODEL,
	DELETE_MODEL,
	ADD_PRODUCT,
	UPDATE_PRODUCT,
	DELETE_PRODUCT,
	SET_ERRORS,
} from './constants';

/**
 * Reducer returning the state.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
const enabled = ( state = false, action ) => {
	switch ( action.type ) {
		case SET_ENABLED: {
			return action.value;
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
const models = ( state = {}, action ) => {
	switch ( action.type ) {
		case ADD_MODEL: {
			return {
				...state,
				[ action.id ]: action.model,
			};
		}

		case UPDATE_MODEL: {
			if ( ! state?.[ action.id ] ) {
				return state;
			}
			let model;
			switch ( action.mode ) {
				case 'recursive':
					model = { ...state[ action.id ] };
					mergeWith( model, action.model, ( obj, src ) => {
						if ( isArray( obj ) ) return src;
					} );
					break;
				case 'set':
					model = { ...action.model };
					break;
				case 'normal':
				default:
					model = { ...state[ action.id ], ...action.model };
			}
			return {
				...state,
				[ action.id ]: model,
			};
		}

		case DELETE_MODEL: {
			return omit( { ...state }, action.id );
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
const products = ( state = {}, action ) => {
	switch ( action.type ) {
		case ADD_PRODUCT: {
			return {
				...state,
				[ action.id ]: action.product,
			};
		}

		case UPDATE_PRODUCT: {
			if ( ! state?.[ action.id ] ) {
				return state;
			}
			let product;
			switch ( action.mode ) {
				case 'recursive':
					product = { ...state[ action.id ] };
					mergeWith( product, action.product, ( obj, src ) => {
						if ( isArray( obj ) ) return src;
					} );
					break;
				case 'set':
					product = { ...action.product };
					break;
				case 'normal':
				default:
					product = { ...state[ action.id ], ...action.product };
			}
			return {
				...state,
				[ action.id ]: product,
			};
		}

		case DELETE_PRODUCT: {
			return omit( { ...state }, action.id );
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
const errors = ( state = {}, action ) => {
	switch ( action.type ) {
		case SET_ERRORS: {
			return action.value;
		}
	}
	return state;
};

const CombinedReducer = combineReducers( {
	enabled,
	models,
	products,
	errors,
} );
export default CombinedReducer;
