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
		//@ts-expect-error
		return select( 'quillForms/document-editor' ).getPostTitle();
	},
} );
