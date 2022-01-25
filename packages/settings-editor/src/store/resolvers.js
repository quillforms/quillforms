/**
 * QuillForms Dependencies
 */
import ConfigAPI from '@quillforms/config';

/**
 * Internal Dependencies
 */
import { setUpStore } from '../../build/store/actions';

export function getSettings( state ) {
	const initialPayload = ConfigAPI.getInitialPayload();
	return setUpStore(
		initialPayload?.settings ? initialPayload.settings : {}
	);
}
