/**
 * Internal Dependencies
 */
import { registerRestField } from '../../api';

registerRestField( 'notifications', {
	getValue: ( select ) => {
		return select( 'quillForms/notifications-editor' ).getNotifications();
	},
} );
