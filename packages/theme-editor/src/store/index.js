import { registerStore } from '@wordpress/data';
import { controls as dataControls } from '@wordpress/data-controls';

import reducer from './reducer';
import * as actions from './actions';
import * as selectors from './selectors';
import * as resolvers from './resolvers';
import * as controls from './controls';
const store = registerStore( 'quillForms/theme-editor', {
	reducer,
	actions,
	selectors,
	resolvers,
	controls: { ...dataControls, ...controls },
} );
export default store;
