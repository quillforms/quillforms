import { createReduxStore, registerStore } from '@wordpress/data';

import reducer from './reducer';
import * as actions from './actions';
import * as selectors from './selectors';
import * as resolvers from './resolvers';
import controls from './controls';

const storeConfig = {
	reducer,
	actions,
	selectors,
	resolvers,
	controls,
};
const store = createReduxStore( 'quillForms/theme-editor', {
	...storeConfig,
} );

registerStore( 'quillForms/theme-editor', {
	...storeConfig,
} );

export default store;
