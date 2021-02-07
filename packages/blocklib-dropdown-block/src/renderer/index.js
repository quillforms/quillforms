/**
 * QuillForms Dependencies
 */
import { setBlockRendererSettings } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import output from './output';
import { type } from '../block.json';
import mergeTag from './merge-tag';
export const rendererSettings = {
	output,
	mergeTag,
};
setBlockRendererSettings( type, rendererSettings );
