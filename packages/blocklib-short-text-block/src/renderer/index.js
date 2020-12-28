/**
 * QuillForms Dependencies
 */
import { setBlockRendererSettings } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import output from './output';
import { type } from '../block.json';

export const rendererSettings = {
	output,
};
setBlockRendererSettings( type, rendererSettings );
