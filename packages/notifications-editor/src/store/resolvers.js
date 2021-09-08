/**
 * QuillForms Dependencies
 */
import ConfigAPI from '@quillforms/config';

/**
 * Internal Dependencies
 */
import { setupStore } from './actions';

export const getNotifications = () => {
	const initialPayload = ConfigAPI.getInitialPayload();
	return setupStore( initialPayload.notifications );
};
