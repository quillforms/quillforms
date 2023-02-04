/**
 * QuillForms Dependencies
 */
import { setBlockRendererSettings } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import { name } from '../block.json';
import rendererSettings from './settings';

setBlockRendererSettings( name, rendererSettings );
