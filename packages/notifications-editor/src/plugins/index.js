import { registerPlugin } from '@wordpress/plugins';
import NotificationEditor from '../components/notification-editor';
registerPlugin( 'notifications-editor', {
	render: () => {
		return <NotificationEditor>Some data</NotificationEditor>;
	},
} );
