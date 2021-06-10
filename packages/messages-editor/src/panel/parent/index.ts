/**
 * QuillForms Dependencies
 */
import { registerBuilderPanel } from '@quillforms/builder-panels';

import Icon from './icon';

registerBuilderPanel( 'settings', {
	title: 'Settings',
	icon: Icon,
	mode: 'parent',
	areaToShow: 'preview-area',
} );
