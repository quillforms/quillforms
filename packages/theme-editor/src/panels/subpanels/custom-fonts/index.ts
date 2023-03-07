import { registerBuilderSubPanel } from '@quillforms/builder-panels';
import render from './render';

registerBuilderSubPanel( 'theme/custom-fonts', {
	title: 'Custom Fonts',
	render,
	position: 3,
} );
