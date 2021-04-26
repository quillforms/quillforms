import { sanitizeBlocks } from '@quillforms/blocks';
import ConfigAPI from '@quillforms/config';
/**
 * Internal dependencies
 */
import { setupStore } from './actions';

export const getBlocks = () => {
	const builderInitialPayload = ConfigAPI.getInitialBuilderPayload();
	return setupStore(
		builderInitialPayload?.blocks
			? sanitizeBlocks( builderInitialPayload.blocks )
			: []
	);
};
