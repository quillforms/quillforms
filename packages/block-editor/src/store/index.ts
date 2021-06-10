/**
 * WordPress Dependencies
 */
import { registerStore } from '@wordpress/data';
import reducer from './reducer';
import * as actions from './actions';
import * as selectors from './selectors';
import * as resolvers from './resolvers';
import { STORE_KEY } from './constants';
import type { State } from './reducer';

import type { DispatchFromMap, SelectFromMap } from '@quillforms/types';

const store = registerStore< State >( STORE_KEY, {
	actions,
	selectors,
	reducer,
	resolvers,
} );
export default store;

declare module '@wordpress/data' {
	function dispatch(
		key: typeof STORE_KEY
	): DispatchFromMap< typeof actions >;
	function select( key: typeof STORE_KEY ): SelectFromMap< typeof selectors >;
}
