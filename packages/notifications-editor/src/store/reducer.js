import { omit } from 'lodash';
import { SET_NOTIFICATION_PROPERTIES, ADD_NEW_NOTIFICATION } from './constants';

const initialState = {
	notifications: [
		{
			id: '1',
			title: 'Admin Notification',
			active: true,
			recipients: [],
			reply_to: '',
			subject: '',
			message: '<p>{{form:all_answers}}</p>',
		},
	],
};

/**
 * Generate random id
 *
 * @return {string} The random id
 */
const generateId = () => {
	return Math.random()
		.toString( 36 )
		.substr( 2, 9 );
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
		case SET_NOTIFICATION_PROPERTIES: {
			const { properties, id } = action.payload;
			const notificationIndex = state.notifications.findIndex(
				( notification ) => notification.id === id
			);
			console.log( notificationIndex );
			if ( notificationIndex === -1 ) {
				return state;
			}

			console.log( state.notifications );
			const notifications = [ ...state.notifications ];

			notifications[ notificationIndex ] = {
				...notifications[ notificationIndex ],
				...properties,
				id: notifications[ notificationIndex ].id,
			};

			return {
				...state,
				notifications,
			};
		}

		case ADD_NEW_NOTIFICATION: {
			const { properties } = action.payload;
			const id = generateId;
			const notifications = [ ...state.notifications ];
			notifications.push( {
				...properties,
				id,
			} );
			return {
				...state,
				notifications,
			};
		}
	}
	return state;
};

export default NotificationsReducer;
