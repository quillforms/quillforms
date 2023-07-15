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
	SET_LABEL,
	SET_ERRORS,
	ADD_COUPON,
	UPDATE_COUPON,
} from './constants';

export default (dispatch) => {
	return {
		updateGeneral: (general, mode = 'normal') => {
			dispatch({
				type: UPDATE_GENERAL,
				general,
				mode,
			});
		},
		addModel: (id, model) => {
			dispatch({
				type: ADD_MODEL,
				id,
				model,
			});
		},
		updateModel: (id, model, mode = 'normal') => {
			dispatch({
				type: UPDATE_MODEL,
				id,
				model,
				mode,
			});
		},
		deleteModel: (id) => {
			dispatch({
				type: DELETE_MODEL,
				id,
			});
		},
		addProduct: (id, product) => {
			dispatch({
				type: ADD_PRODUCT,
				id,
				product,
			});
		},
		updateProduct: (id, product, mode = 'normal') => {
			dispatch({
				type: UPDATE_PRODUCT,
				id,
				product,
				mode,
			});
		},
		deleteProduct: (id) => {
			dispatch({
				type: DELETE_PRODUCT,
				id,
			});
		},
		setLabel: (key, value) => {
			dispatch({
				type: SET_LABEL,
				key,
				value,
			});
		},
		setErrors: (value) => {
			dispatch({
				type: SET_ERRORS,
				value,
			});
		},
		addCoupon: (id, coupon) => {
			dispatch({
				type: ADD_COUPON,
				id,
				coupon,
			});
		},
		updateCoupon: (id, coupon, mode = 'normal') => {
			dispatch({
				type: UPDATE_COUPON,
				id,
				coupon,
				mode,
			});
		},
	};
};
