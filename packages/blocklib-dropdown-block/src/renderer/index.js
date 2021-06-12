/**
 * QuillForms Dependencies
 */
import { setBlockRendererSettings } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import display from './display';
import { name } from '../block.json';
import mergeTag from './merge-tag';
export const rendererSettings = {
	display,
	mergeTag,
};
setBlockRendererSettings( name, rendererSettings );
