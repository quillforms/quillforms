/**
 * QuillForms Dependencies
 */
import ConfigAPI from '@quillforms/config';

/**
 * Internal dependencies
 */
import { setupStore } from './actions';

export const getMessages = () => {
	const builderInitialPayload = ConfigAPI.getInitialBuilderPayload();

	return setupStore( builderInitialPayload.messages );
};
