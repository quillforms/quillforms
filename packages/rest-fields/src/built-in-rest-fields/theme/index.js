/**
 * WordPress Dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import { registerRestField } from '../../api';

registerRestField( 'theme', {
	selectValue: () => {
		return parseInt(
			select( 'quillForms/theme-editor' ).getCurrentThemeId()
		);
	},
} );
