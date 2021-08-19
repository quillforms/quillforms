import { registerIntegrationModule } from '../../api';
import render from './render';
import icon from './icon';
registerIntegrationModule( 'constantcontact', {
	icon,
	render,
	title: 'Constant Contact',
	description:
		"Send new contacts to your Constant Contact lists, and tag them so they're easy to organize",
} );
