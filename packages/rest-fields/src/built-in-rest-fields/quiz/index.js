/**
 * WordPress Dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import { registerRestField } from '../../api';

registerRestField('quiz', {
    selectValue: () => {
        return select('quillForms/quiz-editor').getState();
    },
});
