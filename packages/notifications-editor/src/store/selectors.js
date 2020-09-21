/**
 * Returns notifications state object
 *
 * @param {Object} state     Global application state.
 *
 * @return {Object} Notifications State
 */
export function getNotifications( state ) {
	return state.notifications;
}

/**
 * Returns notification properties
 *
 * @param {Object} state    Global application state.
 * @param {number} id       Notification id.
 *
 * @return {Object} Properties for specific nofifcation id.
 */
export function getNotificationProperties( state, id ) {
	const notificationIndex = state.notifications.findIndex(
		( notification ) => notification.id === id
	);
	if ( notificationIndex === -1 ) {
		return null;
	}
	return state.notifications[ notificationIndex ].properties;
}
