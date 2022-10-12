/**
 * QuillForms Dependencies
 */
import { registerBuilderPanel } from '@quillforms/builder-panels';

/**
 * Internal Dependencies
 */
import render from '@quillforms/admin-components/src/block-types-list';
import Icon from './icon';

registerBuilderPanel( 'blocks', {
	title: 'Form Blocks',
	icon: Icon,
	mode: 'single',
	areaToShow: undefined,
	render,
	position: 0,
} );
