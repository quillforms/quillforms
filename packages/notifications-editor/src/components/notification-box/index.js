/**
 * QuillForms Dependecies
 */
import { ToggleControl } from '@quillforms/builder-components';

/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import { confirmAlert } from 'react-confirm-alert';
import NotificationDeleteDialog from '../notification-delete-dialog';

const NotificationBox = ( { notification, onEdit } ) => {
	const {
		properties: { title, active },
		id,
	} = notification;
	const { setNotificationProperties, deleteNotification } = useDispatch(
		'quillForms/notifications-editor'
	);

	return (
		<div className="notifications-editor-notification-box">
			<div className="notifications-editor-notification-box__title">
				<div className="notifications-editor-notification-box__status">
					<ToggleControl
						checked={ active }
						onChange={ () => {
							setNotificationProperties( id, {
								active: ! active,
							} );
						} }
					/>
				</div>
				{ title }
			</div>
			<div className="notifications-editor-notification-box__actions">
				<div
					role="presentation"
					className="notifications-editor-notification-box__actions-edit"
					onClick={ () => {
						onEdit();
					} }
				>
					Edit
				</div>
				<div
					role="presentation"
					className="notifications-editor-notification-box__actions-delete"
					onClick={ () => {
						confirmAlert( {
							customUI: ( { onClose } ) => {
								return (
									<NotificationDeleteDialog
										closeModal={ () => {
											onClose();
										} }
										proceed={ () => {
											deleteNotification( id );
											onClose();
										} }
									/>
								);
							},
						} );
					} }
				>
					Delete
				</div>
			</div>
		</div>
	);
};

export default NotificationBox;
