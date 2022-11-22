/**
 * WordPress Dependencies
 */
import { createReduxStore, register } from '@wordpress/data';
import reducer from './reducer';
import * as actions from './actions';
import * as selectors from './selectors';
import * as resolvers from './resolvers';
import { STORE_KEY } from './constants';
import type { State } from './reducer';

const store = createReduxStore< State, typeof actions, typeof selectors >(
	STORE_KEY,
	{
		actions,
		selectors,
		reducer,
		resolvers,
	}
);

register( store );
export default store;
