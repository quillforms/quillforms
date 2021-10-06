/**
 * WordPress Dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import { registerRestField } from '../../api';

registerRestField( 'title', {
	selectValue: () => {
		return select( 'quillForms/document-editor' ).getPostTitle();
	},
} );
