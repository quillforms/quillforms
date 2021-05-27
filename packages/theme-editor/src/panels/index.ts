import { registerBuilderPanel } from '@quillforms/builder-panels';
import Icon from './icon';

registerBuilderPanel( 'theme', {
	title: 'Theme',
	icon: Icon,
	mode: 'parent',
	areaToShow: 'preview-area',
	position: 1,
} );
