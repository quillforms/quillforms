/**
 * WordPress Dependencies
 */
import { createContext, useContext } from '@wordpress/element';

const PaymentsContext = createContext({
	settings: {},
	general: {},
	models: {},
	products: {},
	errors: {},
	labels: {},
	coupons: {},
	updateGeneral: (_general, _mode = 'recursive') => {
		throw 'updateGeneral() not implemented.';
	},
	addModel: (_id, _model) => {
		throw 'addModel() not implemented.';
	},
	updateModel: (_id, _model, _mode = 'recursive') => {
		throw 'updateModel() not implemented.';
	},
	deleteModel: (_id) => {
		throw 'deleteModel() not implemented.';
	},
	addProduct: (_id, _product) => {
		throw 'addProduct() not implemented.';
	},
	updateProduct: (_id, _product, _mode = 'recursive') => {
		throw 'updateProduct() not implemented.';
	},
	deleteProduct: (_id) => {
		throw 'deleteProduct() not implemented.';
	},
	setLabel: (_key, _value) => {
		throw 'setLabel() not implemented.';
	},
	addCoupon: (_id, _coupon) => {
		throw 'addCoupon() not implemented.';
	},
	updateCoupon: (_id, _coupon, _mode = 'recursive') => {
		throw 'updateCoupon() not implemented.';
	},
	deleteCoupon: (_id) => {
		throw 'deleteCoupon() not implemented.';
	}
});

const PaymentsContextProvider = PaymentsContext.Provider;
const usePaymentsContext = () => useContext(PaymentsContext);

export { PaymentsContext, PaymentsContextProvider, usePaymentsContext };
