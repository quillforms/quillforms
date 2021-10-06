/**
 * WordPress Dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import { registerRestField } from '../../api';

registerRestField( 'messages', {
	selectValue: () => {
		return select( 'quillForms/messages-editor' ).getMessages();
	},
} );
