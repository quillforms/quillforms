/**
 * QuillForms Dependecies
 */
import { ToggleControl } from '@quillforms/builder-components';

/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';

const NotificationBox = ( { notification, onEdit } ) => {
	const { title, active, id } = notification;
	const { setNotificationProperties } = useDispatch(
		'quillForms/notifications-editor'
	);

	return (
		<div className="notifications-editor-notification-box">
			<div className="notifications-editor-notification-box__title">
				<div className="notifications-editor-notification-box__status">
					<ToggleControl
						checked={ active }
						onChange={ () => {
							setNotificationProperties(
								{ active: ! active },
								id
							);
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
				>
					Delete
				</div>
			</div>
		</div>
	);
};

export default NotificationBox;
