/**
 * Internal Dependencies
 */
import { registerFormMeta } from '../../api';

registerFormMeta( 'messages', {
	getValue: ( select ) => {
		return select( 'quillForms/messages-editor' ).getMessages();
	},
} );
