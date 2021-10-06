/**
 * WordPress Dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import { registerRestField } from '../../api';

registerRestField( 'slug', {
	selectValue: () => {
		return select( 'quillForms/document-editor' ).getPostSlug();
	},
} );
