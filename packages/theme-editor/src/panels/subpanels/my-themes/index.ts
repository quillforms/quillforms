import { registerBuilderSubPanel } from '@quillforms/builder-panels';
import { MyThemesPanel as render } from '@quillforms/theme-editor';

registerBuilderSubPanel( 'theme/my-themes', {
	title: 'My Themes',
	render,
} );
