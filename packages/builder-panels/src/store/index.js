import * as dataPackage from '@wordpress/data';
import reducer from './reducer';
import * as actions from './actions';
import * as selectors from './selectors';
const { registerStore } = dataPackage;
const store = registerStore( 'quillForms/builder-panels', {
	reducer,
	actions,
	selectors,
} );
export default store;
