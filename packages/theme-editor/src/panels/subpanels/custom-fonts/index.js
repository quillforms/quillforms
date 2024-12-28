import { registerBuilderSubPanel } from '@quillforms/builder-panels';
import render from './render';

registerBuilderSubPanel('settings/custom-fonts', {
    title: 'Custom Fonts',
    render,
    position: 100,
});