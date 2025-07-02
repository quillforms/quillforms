/**
 * QuillForms Dependencies
 */
import { setBlockRendererSettings } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import './style.scss';
import { name } from '../block.json';
import display from './display';
import mergeTag from './merge-tag';

export const rendererSettings = {
    display,
    mergeTag,
    displayLayout: 'split-right',
};

setBlockRendererSettings(name, rendererSettings);
