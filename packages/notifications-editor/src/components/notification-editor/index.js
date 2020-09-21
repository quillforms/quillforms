/**
 * WordPress Dependencies
 */
import { createSlotFill } from '@wordpress/components';

const { Fill, Slot } = createSlotFill( 'NotificationEditor' );

const NotificationEditorSlot = ( {
	notificationProperties,
	setNotificationProperties,
} ) => {
	return (
		<Slot
			fillProps={ ( notificationProperties, setNotificationProperties ) }
		>
			{ ( fills ) => {
				return <div className="just-wrapper"> { fills } </div>;
			} }
		</Slot>
	);
};
const NotificationEditorFill = ( { children } ) => {
	return <Fill>{ children }</Fill>;
};

const NotificationEditor = NotificationEditorFill;
NotificationEditor.Slot = NotificationEditorSlot;

export default NotificationEditor;
