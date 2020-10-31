import {
	SETUP_STORE,
	SET_NOTIFICATION_PROPERTIES,
	ADD_NEW_NOTIFICATION,
	DELETE_NOTIFICATION,
} from './constants';

/**
 * Set up the store.
 *
 * @param {Object} initialPayload Initial payload object.
 *
 * @return {Object} Action object.
 */
export function setupStore( initialPayload ) {
	return {
		type: SETUP_STORE,
		payload: { initialPayload },
	};
}

/**
 * Returns an action object used in setting notification properties.
 *
 * @param {string} id           The notification id.
 * @param {Object} properties   Notification properties
 *
 * @return {Object} Action object.
 */
export const setNotificationProperties = ( id, properties ) => {
	return {
		type: SET_NOTIFICATION_PROPERTIES,
		payload: { properties, id },
	};
};

/**
 * Add new notifcation.
 *
 * @param {Object} properties  Notification properties.
 *
 * @return {Object} Action object.
 */
export const addNewNotification = ( properties ) => {
	return {
		type: ADD_NEW_NOTIFICATION,
		payload: { properties },
	};
};

/**
 * Delete Notification
 *
 * @param {number} id Notification id.
 *
 * @return {Object} Action object.
 */
export const deleteNotification = ( id ) => {
	return {
		type: DELETE_NOTIFICATION,
		payload: { id },
	};
};
