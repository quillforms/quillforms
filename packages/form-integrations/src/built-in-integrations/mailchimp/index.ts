import { registerIntegrationModule } from '../../api';
import render from './render';
import icon from './icon';
registerIntegrationModule( 'mailchimp', {
	icon,
	render,
	title: 'MailChimp',
	description:
		"Send new contacts to your Mailchimp lists, and tag them so they're easy to organize",
} );
