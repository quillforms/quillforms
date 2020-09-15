/**
 * Internal dependencies
 */
import { setupStore } from './actions';

export const getFormStructure = () => {
	console.log( 'working' );
	return setupStore( window.qfInitialPayload.blocks );
};
