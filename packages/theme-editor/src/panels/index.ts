import { registerBuilderPanel } from '@quillforms/builder-panels';
import Icon from './icon';
import render from '../components/render';

registerBuilderPanel( 'theme', {
	title: 'My Themes',
	icon: Icon,
	mode: 'single',
	render,
	position: 1,
} );
