export { default as store } from './store';
export * from './api';
export * from './types';
import { registerBlockType } from './api';
import icon from './partial-submission-icon';
// Register the block type

registerBlockType('partial-submission-point', {
    icon,
    title: 'Partial Submission Point',

});