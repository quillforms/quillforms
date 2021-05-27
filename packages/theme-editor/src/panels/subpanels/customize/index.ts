import { registerBuilderSubPanel } from '@quillforms/builder-panels';
import render from '../../../components/customize';

registerBuilderSubPanel( 'theme/customize', {
	title: 'Customize',
	render,
	position: 1,
} );
