/**
 * QuillForms Dependencies
 */
import ConfigAPI from '@quillforms/config';

/**
 * Internal Dependencies
 */
import { setupStore } from './actions';

export const getNotifications = () => {
	const builderInitialPayload = ConfigAPI.getInitialBuilderPayload();
	return setupStore( builderInitialPayload.notifications );
};
