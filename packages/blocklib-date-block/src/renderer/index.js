/**
 * QuillForms Dependencies
 */
import { setBlockRendererSettings } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import display from './display';
import { type } from '../block.json';

export const rendererSettings = {
	display,
};
setBlockRendererSettings( type, rendererSettings );
