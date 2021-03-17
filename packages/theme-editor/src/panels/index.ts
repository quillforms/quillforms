import { registerBuilderPanel } from '@quillforms/builder-panels';
import Icon from './icon';
import './subpanels/customize';
import './subpanels/my-themes';

registerBuilderPanel( 'theme', {
	title: 'Theme',
	icon: Icon,
	mode: 'parent',
	areaToShow: 'preview-area',
} );
