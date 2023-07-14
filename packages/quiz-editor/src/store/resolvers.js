/**
 * QuillForms Dependencies
 */
import ConfigAPI from '@quillforms/config';

/**
 * Internal Dependencies
 */
import { setCustomCSS } from '../../build/store/actions';

export function getCustomCSS( state ) {
	const initialPayload = ConfigAPI.getInitialPayload();
	return setCustomCSS( initialPayload.customCSS ?? '' );
}
