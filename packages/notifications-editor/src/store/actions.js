import { SET_NOTIFICATIONS_PROPERTIES } from './constants';

/**
 * Returns an action object used in setting theme properties.
 *
 * @param {Object} properties Theme properties which should define its output behavior
 * @param {string} type	 	  Notifications type (self or respondent)
 *
 * @return {Object} Action object.
 */
export const setNotificationsProperties = ( properties, type = 'self' ) => {
	return {
		type: SET_NOTIFICATIONS_PROPERTIES,
		payload: { properties, type },
	};
};
