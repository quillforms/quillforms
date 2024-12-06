/**
 * QuillForms Dependencies
 */
import { registerBuilderPanel } from '@quillforms/builder-panels';
import icon from './icon';
/**
 * Internal Dependencies
 */
import render from '../components/panel-render';
registerBuilderPanel('quiz', {
    title: 'Correct/Incorrect Answers',
    icon,
    mode: 'single',
    areaToShow: 'drop-area',
    render
});
