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
			[ randomId() ]: getModelDefaultState( 'Payment Model #1' ),
		},
		labels: {
			order_details_heading: 'Order Details',
			select_payment_method: 'Select a payment method',
			order_total: 'Total',
			pay: 'Pay Now',
		},
		products: {},
		errors: {
			products: {},
		},
	};

	if ( isObject( ConfigApi.getInitialPayload().payments ) ) {
		const payments = ConfigApi.getInitialPayload().payments;

		// separate models.
		const models = payments.models;
		delete payments.models;

		// separate labels.
		const labels = payments.labels;
		delete payments.labels;

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
		};
	}

	if ( isObject( ConfigApi.getInitialPayload().products ) ) {
		state = { ...state, products: ConfigApi.getInitialPayload().products };
	}

	return state;
};

const getModelDefaultState = ( name ) => {
	return {
		name,
		recurring: false,
		conditions: false,
	};
};

const randomId = () => {
	return Math.random().toString( 36 ).substring( 2, 8 );
};

const isObject = ( variable ) => {
	return (
		typeof variable === 'object' &&
		variable !== null &&
		! Array.isArray( variable )
	);
};

export { getInitialState, getModelDefaultState, randomId, isObject };
