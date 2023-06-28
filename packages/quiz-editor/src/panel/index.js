/**
 * QuillForms Dependencies
 */
import { registerBuilderPanel } from '@quillforms/builder-panels';
/**
 * Internal Dependencies
 */
import render from '../components/panel-render';
registerBuilderPanel('quiz', {
    title: 'Correct/Incorrect Answers',
    icon: 'yes-alt',
    mode: 'single',
    areaToShow: 'drop-area',
    render
});
