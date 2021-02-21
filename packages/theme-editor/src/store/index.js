import { registerStore } from '@wordpress/data';

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

registerStore( 'quillForms/theme-editor', {
	...storeConfig,
} );
