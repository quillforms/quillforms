import { registerBuilderSubPanel } from '@quillforms/builder-panels';
import render from '../../../components/gallery';

registerBuilderSubPanel( 'theme/gallery', {
	title: 'Gallery',
	render,
	position: 1,
} );
