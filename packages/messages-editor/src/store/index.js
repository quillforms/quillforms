import { registerStore } from '@wordpress/data';
import reducer from './reducer';
import * as actions from './actions';
import * as selectors from './selectors';
import * as resolvers from './resolvers';
const store = registerStore( 'quillForms/messages-editor', {
	reducer,
	actions,
	selectors,
	resolvers,
} );
export default store;
