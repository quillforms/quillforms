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
	UPDATE_GENERAL,
	ADD_MODEL,
	UPDATE_MODEL,
	DELETE_MODEL,
	ADD_PRODUCT,
	UPDATE_PRODUCT,
	DELETE_PRODUCT,
	SET_ERRORS,
	SET_LABEL,
	ADD_COUPON,
	UPDATE_COUPON,
} from './constants';

/**
 * Reducer returning the state.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
const general = (state = false, action) => {
	switch (action.type) {
		case UPDATE_GENERAL: {
			switch (action.mode) {
				case 'recursive':
					const $general = { ...state };
					mergeWith($general, action.general, (obj, src) => {
						if (isArray(obj)) return src;
					});
					return $general;
				case 'set':
					return { ...action.general };
				case 'normal':
				default:
					return { ...state, ...action.general };
			}
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
const models = (state = {}, action) => {
	switch (action.type) {
		case ADD_MODEL: {
			return {
				...state,
				[action.id]: action.model,
			};
		}

		case UPDATE_MODEL: {
			if (!state?.[action.id]) {
				return state;
			}
			let model;
			switch (action.mode) {
				case 'recursive':
					model = { ...state[action.id] };
					mergeWith(model, action.model, (obj, src) => {
						if (isArray(obj)) return src;
					});
					break;
				case 'set':
					model = { ...action.model };
					break;
				case 'normal':
				default:
					model = { ...state[action.id], ...action.model };
			}
			return {
				...state,
				[action.id]: model,
			};
		}

		case DELETE_MODEL: {
			return omit({ ...state }, action.id);
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
const products = (state = {}, action) => {
	switch (action.type) {
		case ADD_PRODUCT: {
			return {
				...state,
				[action.id]: action.product,
			};
		}

		case UPDATE_PRODUCT: {
			if (!state?.[action.id]) {
				return state;
			}
			let product;
			switch (action.mode) {
				case 'recursive':
					product = { ...state[action.id] };
					mergeWith(product, action.product, (obj, src) => {
						if (isArray(obj)) return src;
					});
					break;
				case 'set':
					product = { ...action.product };
					break;
				case 'normal':
				default:
					product = { ...state[action.id], ...action.product };
			}
			return {
				...state,
				[action.id]: product,
			};
		}

		case DELETE_PRODUCT: {
			return omit({ ...state }, action.id);
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

const labels = (state = {}, action) => {
	switch (action.type) {
		case SET_LABEL: {
			return {
				...state,
				[action.key]: action.value,
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
const coupons = (state = {}, action) => {
	switch (action.type) {
		case ADD_COUPON: {
			return {
				...state,
				[action.id]: action.coupon,
			};
		}

		case UPDATE_COUPON: {
			if (!state?.[action.id]) {
				return state;
			}
			let coupon;
			switch (action.mode) {
				case 'recursive':
					coupon = { ...state[action.id] };
					mergeWith(coupon, action.coupon, (obj, src) => {
						if (isArray(obj)) return src;
					});
					break;
				case 'set':
					coupon = { ...action.coupon };
					break;
				case 'normal':
				default:
					coupon = { ...state[action.id], ...action.coupon };
			}

			return {
				...state,
				[action.id]: coupon,
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
const errors = (state = {}, action) => {
	switch (action.type) {
		case SET_ERRORS: {
			return action.value;
		}
	}
	return state;
};

const CombinedReducer = combineReducers({
	general,
	models,
	products,
	labels,
	coupons,
	errors,
});
export default CombinedReducer;
