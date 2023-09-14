import ConfigApi from '@quillforms/config';

const getInitialState = () => {
	// general is "payments" rest field except "models" & "labels".
	// products is "products" rest field.
	let state = {
		general: {
			enabled: false,
			currency: { code: 'USD', symbol_pos: 'left' },
			methods: {},
			gateways_options: {},
		},
		models: {
			[randomId()]: getModelDefaultState('Payment Model #1'),
		},
		labels: {
			order_details_heading: 'Order Details',
			select_payment_method: 'Select a payment method',
			order_total: 'Total',
			pay: 'Pay Now',
			discountQuestion: 'You have a coupon?',
			discountPlaceholder: 'Enter your discount code',
			applyDiscount: 'Apply',
		},
		products: {},
		coupons: {},
		errors: {
			products: {},
		},
	};

	if (isObject(ConfigApi.getInitialPayload().payments)) {
		const payments = ConfigApi.getInitialPayload().payments;

		// separate models.
		const models = payments.models;
		delete payments.models;

		// separate labels.
		const labels = payments.labels;
		delete payments.labels;

		// separate coupons.
		const coupons = payments.coupons;
		delete payments.coupons;

		state = {
			...state,
			general: {
				...state.general,
				...payments,
			},
			models: models,
			labels: {
				...state.labels,
				...labels,
			},
			coupons: coupons,
		};
	}

	if (isObject(ConfigApi.getInitialPayload().products)) {
		state = { ...state, products: ConfigApi.getInitialPayload().products };
	}

	return state;
};

const getModelDefaultState = (name) => {
	return {
		name,
		recurring: false,
		conditions: false,
	};
};

const getCouponDefaultState = () => {
	return {
		name: '',
		code: '',
		discount_type: 'percent',
		amount: '',
		minimum_amount: '',
		maximum_amount: '',
		start_date: '',
		end_date: '',
		usage_limit: '',
	}
};

const randomId = () => {
	return Math.random().toString(36).substring(2, 8);
};

const isObject = (variable) => {
	return (
		typeof variable === 'object' &&
		variable !== null &&
		!Array.isArray(variable)
	);
};

export { getInitialState, getModelDefaultState, getCouponDefaultState, randomId, isObject };
