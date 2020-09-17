import { SET_NOTIFICATION_PROPERTIES, ADD_NEW_NOTIFICATION } from './constants';

/**
 * Returns an action object used in setting theme properties.
 *
 * @param {Object} properties   Theme properties which should define its output behavior
 * @param {string} id           The notification id.
 *
 * @return {Object} Action object.
 */
export const setNotificationProperties = ( properties, id ) => {
	return {
		type: SET_NOTIFICATION_PROPERTIES,
		payload: { properties, id },
	};
};

/**
 * Add new notifcation.
 *
 * @param {Object} properties  Notification properties
 *
 * @return {Object} Action object.
 */
export const addNewNotification = ( properties ) => {
	return {
		type: ADD_NEW_NOTIFICATION,
		payload: { properties },
	};
};
