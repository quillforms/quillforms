/**
 * Internal Dependencies
 */
import { registerFormMeta } from '../../api';

registerFormMeta( 'theme_id', {
	getValue: ( select ) => {
		return select( 'quillForms/theme-editor' ).getCurrentThemeId();
	},
} );
