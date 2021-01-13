/**
 * Internal Dependencies
 */
import { registerRestField } from '../../api';

registerRestField( 'theme', {
	getValue: ( select ) => {
		return parseInt(
			select( 'quillForms/theme-editor' ).getCurrentThemeId()
		);
	},
} );
