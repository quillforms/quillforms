/**
 * QuillForms Dependencies
 */
import ConfigAPI from '@quillforms/config';

/**
 * Internal Dependencies
 */
import { setPostSlug, setPostTitle } from '../../build/store/actions';

export function getPostSlug( state ) {
	const initialPayload = ConfigAPI.getInitialPayload();
	return setPostSlug( initialPayload.slug );
}

export function getPostTitle( state ) {
	const initialPayload = ConfigAPI.getInitialPayload();
	return setPostTitle(
		initialPayload?.title?.rendered ? initialPayload?.title?.rendered : ''
	);
}
