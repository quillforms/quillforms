/**
 * Internal Dependencies
 */
import { registerRestField } from '../../api';

registerRestField( 'messages', {
	getValue: ( select ) => {
		return select( 'quillForms/messages-editor' ).getMessages();
	},
} );
