/**
 * QuillForms Dependencies
 */
import ConfigAPI from '@quillforms/config';

/**
 * Internal Dependencies
 */
import { setPostSlug, setPostTitle } from '../../build/store/actions';

export function getPostSlug( state ) {
	const builderInitialPayload = ConfigAPI.getInitialBuilderPayload();
	return setPostSlug( builderInitialPayload.slug );
}

export function getPostTitle( state ) {
	const builderInitialPayload = ConfigAPI.getInitialBuilderPayload();
	return setPostTitle(
		builderInitialPayload?.title?.rendered
			? builderInitialPayload?.title?.rendered
			: ''
	);
}
