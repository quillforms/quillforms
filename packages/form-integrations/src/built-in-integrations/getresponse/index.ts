import { registerIntegrationModule } from '../../api';
import render from './render';
import icon from './icon';
registerIntegrationModule( 'getresponse', {
	icon,
	render,
	title: 'GetResponse',
	description:
		"Send new contacts to your GetResponse lists, and tag them so they're easy to organize",
} );
