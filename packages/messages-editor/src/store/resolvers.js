/**
 * QuillForms Dependencies
 */
import ConfigAPI from '@quillforms/config';

/**
 * Internal dependencies
 */
import { setupStore } from './actions';

export const getMessages = () => {
	const initialPayload = ConfigAPI.getInitialPayload();
	return setupStore( initialPayload.messages );
};
