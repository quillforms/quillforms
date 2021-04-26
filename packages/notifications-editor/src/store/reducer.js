/**
 * External Dependencies
 */
import { reduce } from 'lodash';

/**
 * Internal Dependencies
 */
import {
	SETUP_STORE,
	SET_NOTIFICATION_PROPERTIES,
	ADD_NEW_NOTIFICATION,
	DELETE_NOTIFICATION,
} from './constants';

const initialState = {
	notifications: [],
};

/**
 * Returns an object against which it is safe to perform mutating operations,
 * given the original object and its current working copy.
 *
 * @param {Object} original Original object.
 * @param {Object} working  Working object.
 *
 * @return {Object} Mutation-safe object.
 */
function getMutateSafeObject( original, working ) {
	if ( original === working ) {
		return { ...original };
	}

	return working;
}

/**
 * Generate random id
 *
 * @return {string} The random id
 */
const generateId = () => {
	return Math.random().toString( 36 ).substr( 2, 9 );
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
		// SET UP STORE
		case SETUP_STORE: {
			const { initialPayload } = action.payload;
			return { ...state, notifications: initialPayload };
		}
		case SET_NOTIFICATION_PROPERTIES: {
			const { properties, id } = action.payload;
			const notificationIndex = state.notifications.findIndex(
				( notification ) => notification.id === id
			);
			if ( notificationIndex === -1 ) {
				return state;
			}

			// Consider as updates only changed values
			const nextProperties = reduce(
				properties,
				( result, value, key ) => {
					if ( value !== result[ key ] ) {
						result = getMutateSafeObject(
							[ ...state.notifications ][ notificationIndex ]
								.properties,
							result
						);
						result[ key ] = value;
					}

					return result;
				},
				state.notifications[ notificationIndex ].properties
			);

			// Skip update if nothing has been changed. The reference will
			// match the original notification if `reduce` had no changed values.
			if (
				nextProperties ===
				state.notifications[ notificationIndex ].properties
			) {
				return state;
			}

			// Otherwise replace properties in state
			const notifications = [ ...state.notifications ];
			notifications[ notificationIndex ].properties = {
				...nextProperties,
			};
			return {
				...state,
				notifications,
			};
		}

		case ADD_NEW_NOTIFICATION: {
			const { properties } = action.payload;
			const id = generateId();
			const notifications = [ ...state.notifications ];
			notifications.push( {
				properties,
				id,
			} );
			return {
				...state,
				notifications,
			};
		}

		case DELETE_NOTIFICATION: {
			const { id } = action.payload;
			const notificationIndex = state.notifications.findIndex(
				( notification ) => notification.id === id
			);
			if ( notificationIndex === -1 ) {
				return state;
			}
			const notifications = [ ...state.notifications ];
			notifications.splice( notificationIndex, 1 );
			return {
				notifications,
			};
		}
	}
	return state;
};

export default NotificationsReducer;
