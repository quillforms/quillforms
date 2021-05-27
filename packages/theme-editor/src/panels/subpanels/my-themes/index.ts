import { registerBuilderSubPanel } from '@quillforms/builder-panels';
import render from '../../../components/themes-list';

registerBuilderSubPanel( 'theme/my-themes', {
	title: 'My Themes',
	render,
	position: 0,
} );
