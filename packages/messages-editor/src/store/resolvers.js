/**
 * Internal dependencies
 */
import { setupStore } from './actions';

export const getMessages = () => {
	return setupStore( window.qfInitialPayload.messages );
};
