import { registerIntegrationModule } from '../../api';
import render from './render';
import icon from './icon';
registerIntegrationModule( 'googlesheets', {
	icon,
	render,
	title: 'Google Sheets',
	description: 'Send new entries to your google sheets',
} );
