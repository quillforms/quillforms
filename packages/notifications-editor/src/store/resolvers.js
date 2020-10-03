import { setupStore } from './actions';

export const getNotifications = () => {
	console.log( window.qfInitialPayload );
	return setupStore( window.qfInitialPayload.notifications );
};
