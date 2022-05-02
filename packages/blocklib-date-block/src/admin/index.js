/**
 * QuillForms Dependencies
 */
import { setBlockAdminSettings } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import { name } from '../block.json';
import blockAdminSettings from './settings';

setBlockAdminSettings( name, blockAdminSettings );
