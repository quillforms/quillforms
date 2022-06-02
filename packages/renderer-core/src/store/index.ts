/**
 * WordPress Dependencies
 */
import { register, createReduxStore } from '@wordpress/data';
import reducer from './reducer';
import * as actions from './actions';
import * as selectors from './selectors';
import { STORE_KEY } from './constants';
import type { State } from './reducer';

import type { DispatchFromMap, SelectFromMap } from '@quillforms/types';

const store = createReduxStore< State >( STORE_KEY, {
	actions,
	selectors,
	reducer,
} );
export default store;
register( store );
declare module '@wordpress/data' {
	function dispatch(
		key: typeof STORE_KEY
	): DispatchFromMap< typeof actions >;
	function select( key: typeof STORE_KEY ): SelectFromMap< typeof selectors >;
}
