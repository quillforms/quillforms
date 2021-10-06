/**
 * WordPress Dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import { registerRestField } from '../../api';

registerRestField( 'blocks', {
	selectValue: () => {
		return select( 'quillForms/block-editor' ).getBlocks();
	},
} );
