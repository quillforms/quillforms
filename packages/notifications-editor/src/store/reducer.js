import { SET_NOTIFICATIONS_PROPERTIES } from './constants';

const initialState = {
	self: {
		enabled: true,
		recipients: [],
		reply_to: '',
		subject: '',
		message: '<p>{{form:all_answers}}</p>',
	},
	respondent: {
		enabled: true,
		recipients: [],
		reply_to: '',
		subject: '',
		message: '<p></p>',
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
const NotificationsReducer = ( state = initialState, action ) => {
	switch ( action.type ) {
		case SET_NOTIFICATIONS_PROPERTIES: {
			const { properties, type } = action.payload;
			const $state = { ...state };
			$state[ type ] = { ...$state[ type ], ...properties };
			// console.log($state);
			return $state;
		}
	}
	return state;
};

export default NotificationsReducer;
