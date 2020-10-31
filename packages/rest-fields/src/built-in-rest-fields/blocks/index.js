/**
 * Internal Dependencies
 */
import { registerRestField } from '../../api';

registerRestField( 'blocks', {
	getValue: ( select ) => {
		return select( 'quillForms/block-editor' ).getBlocks();
	},
} );
