/**
 * QuillForms Dependencies
 */
import { setBlockRendererSettings } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import display from './display';
import mergeTag from './merge-tag';
import { type } from '../block.json';

export const rendererSettings = {
	display,
	mergeTag,
};
setBlockRendererSettings( type, rendererSettings );
