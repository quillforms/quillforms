/**
 * WordPress Dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import { registerRestField } from '../../api';

registerRestField( 'settings', {
	selectValue: () => {
		return select( 'quillForms/settings-editor' ).getSettings();
	},
} );
