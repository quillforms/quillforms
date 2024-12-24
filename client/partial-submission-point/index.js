import { registerBlockType } from '@quillforms/blocks';
import display from './display';
import icon from './icon';
import "./style.css"
// Register the block type

registerBlockType('partial-submission-point', {
    icon,
    title: 'Partial Submission Point',
    supports: {
        editable: false
    },
    display
});