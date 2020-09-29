/**
 * Internal Dependencies
 */
import { registerFormMeta } from '../../api';

registerFormMeta( 'settings', {
	getValue: ( select ) => {
		return select( 'quillForms/settings-editor' ).getSettings();
	},
} );
