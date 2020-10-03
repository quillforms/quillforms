/**
 * Internal dependencies
 */
import { __experimentalSetPostId } from './actions';

export const getPostId = () => {
	return __experimentalSetPostId( window.qfInitialPayload.id );
};
