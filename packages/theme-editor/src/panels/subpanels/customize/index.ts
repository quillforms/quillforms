import { registerBuilderSubPanel } from '@quillforms/builder-panels';
import { CustomizePanel as render } from '@quillforms/theme-editor';

registerBuilderSubPanel( 'theme/customize', {
	title: 'Customize',
	render,
} );
