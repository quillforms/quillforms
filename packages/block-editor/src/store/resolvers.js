/**
 * Internal dependencies
 */
import { setupStore } from './actions';

export const getBlocks = () => {
	console.log( 'working' );
	return setupStore( window.qfInitialPayload.blocks );
};
