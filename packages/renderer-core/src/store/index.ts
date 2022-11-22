/**
 * WordPress Dependencies
 */
import { register, createReduxStore } from '@wordpress/data';
import reducer from './reducer';
import * as actions from './actions';
import * as selectors from './selectors';
import { STORE_KEY } from './constants';
import type { State } from './reducer';

const store = createReduxStore< State, typeof actions, typeof selectors >(
	STORE_KEY,
	{
		actions,
		selectors,
		reducer,
	}
);
export default store;
register( store );
