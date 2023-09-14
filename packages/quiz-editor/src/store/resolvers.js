/**
 * QuillForms Dependencies
 */
import ConfigAPI from '@quillforms/config';

/**
 * Internal Dependencies
 */
import { setupStore } from '../../build/store/actions';

export function getState(state) {
	const initialPayload = ConfigAPI.getInitialPayload();
	return setupStore(initialPayload.quiz ?? {});
}
