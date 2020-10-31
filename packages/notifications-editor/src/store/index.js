import { registerStore } from '@wordpress/data';
import reducer from './reducer';
import * as actions from './actions';
import * as selectors from './selectors';
import * as resolvers from './resolvers';
const store = registerStore( 'quillForms/notifications-editor', {
	reducer,
	actions,
	resolvers,
	selectors,
} );
export default store;
