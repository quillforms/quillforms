/**
 * QuillForms Dependencies
 */
import { setBlockRendererSettings } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import display from './display';
import { type } from '../block.json';
import mergeTag from './merge-tag';
export const rendererSettings = {
	display,
	mergeTag,
};
setBlockRendererSettings( type, rendererSettings );
