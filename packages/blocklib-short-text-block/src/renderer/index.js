/**
 * QuillForms Dependencies
 */
import { setBlockRendererSettings } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import display from './display';
import { name } from '../block.json';

export const rendererSettings = {
	display,
};
setBlockRendererSettings( name, rendererSettings );
