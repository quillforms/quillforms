/**
 * QuillForms Dependencies
 */
import { setBlockRendererSettings } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import output from './output';
import mergeTag from './merge-tag';
import { type } from '../block.json';

export const rendererSettings = {
	output,
	mergeTag,
};
setBlockRendererSettings( type, rendererSettings );
