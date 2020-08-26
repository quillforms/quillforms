/**
 * Internal Dependencies
 */
import { registerFormMeta } from '../../api';

registerFormMeta( 'notifications', {
	getValue: ( select ) => {
		return select( 'quillForms/notifications-editor' ).getNotifications();
	},
} );
