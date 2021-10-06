/**
 * WordPress Dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import { registerRestField } from '../../api';

registerRestField( 'notifications', {
	selectValue: () => {
		return select( 'quillForms/notifications-editor' ).getNotifications();
	},
} );
