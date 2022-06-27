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

export default ( dispatch ) => {
	return {
		setEnabled: ( value ) => {
			dispatch( {
				type: SET_ENABLED,
				value,
			} );
		},
		addModel: ( id, model ) => {
			dispatch( {
				type: ADD_MODEL,
				id,
				model,
			} );
		},
		updateModel: ( id, model, mode = 'normal' ) => {
			dispatch( {
				type: UPDATE_MODEL,
				id,
				model,
				mode,
			} );
		},
		deleteModel: ( id ) => {
			dispatch( {
				type: DELETE_MODEL,
				id,
			} );
		},
		addProduct: ( id, product ) => {
			dispatch( {
				type: ADD_PRODUCT,
				id,
				product,
			} );
		},
		updateProduct: ( id, product, mode = 'normal' ) => {
			dispatch( {
				type: UPDATE_PRODUCT,
				id,
				product,
				mode,
			} );
		},
		deleteProduct: ( id ) => {
			dispatch( {
				type: DELETE_PRODUCT,
				id,
			} );
		},
		setErrors: ( value ) => {
			dispatch( {
				type: SET_ERRORS,
				value,
			} );
		},
	};
};
