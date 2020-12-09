/**
 * Internal dependencies
 */
import { setupStore } from './actions';

export const getBlocks = () => {
	return setupStore( window.qfInitialPayload.blocks );
};
