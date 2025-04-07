/**
 * WordPress Dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import { registerRestField } from '../../api';

registerRestField('customCSS', {
	selectValue: () => {
		return select('quillForms/code-editor').getCustomCSS();
	},
});
