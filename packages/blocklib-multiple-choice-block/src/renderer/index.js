/**
 * QuillForms Dependencies
 */
import { setBlockRendererSettings } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import display from './display';
import mergeTag from './merge-tag';
import { name } from '../block.json';

export const rendererSettings = {
	display,
	mergeTag,
};
setBlockRendererSettings( name, rendererSettings );
