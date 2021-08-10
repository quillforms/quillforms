import { sanitizeBlocks } from '@quillforms/blocks';
import ConfigAPI from '@quillforms/config';
/**
 * Internal dependencies
 */
import { setupStore } from './actions';

export const getBlocks = () => {
	const initialPayload = ConfigAPI.getInitialPayload();
	return setupStore(
		initialPayload?.blocks ? sanitizeBlocks( initialPayload.blocks ) : []
	);
};
