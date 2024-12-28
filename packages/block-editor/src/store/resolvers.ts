import { sanitizeBlocks } from '@quillforms/blocks';
import ConfigAPI from '@quillforms/config';
/**
 * Internal dependencies
 */
import { setupStore } from './actions';

export const getBlocksWithPartialSubmission = () => {
	const initialPayload = ConfigAPI.getInitialPayload();
	//console.log('initial payload', initialPayload);
	return setupStore(
		initialPayload?.blocks ? sanitizeBlocks(initialPayload.blocks) : []
	);
};
