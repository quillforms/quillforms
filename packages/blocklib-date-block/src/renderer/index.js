/**
 * QuillForms Dependencies
 */
import { setBlockRendererSettings } from '@quillforms/blocks';
import rendererSettings from './settings';
import { name } from '../block.json';

setBlockRendererSettings( name, rendererSettings );
