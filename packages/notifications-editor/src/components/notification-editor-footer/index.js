/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
import { createPortal } from 'react-dom';
import { __ } from '@wordpress/i18n';

const NotificationEditorFooter = ({
	goBack,
	onSuccess,
	notificationId,
	properties,
	validationFlags,
	isReviewing,
	setIsReviewing,
}) => {
	const { setNotificationProperties, addNewNotification } = useDispatch(
		'quillForms/notifications-editor'
	);
	const isFormInValid =
		Object.keys(validationFlags).filter(
			(key) => validationFlags[key] === false
		).length > 0;

	return createPortal(
		<div className="notifications-editor-notification-edit__footer">
			<Button
				isDefault
				className="notifications-editor-notification-edit__footer-cancel"
				onClick={() => {
					goBack();
				}}
			>
				{__('Cancel & go back', 'quillforms')}
			</Button>
			{isReviewing && isFormInValid ? (
				<Button isDanger>{__('Some fields aren\'t valid', 'quillforms')} </Button>
			) : (
				<Button
					isPrimary
					className="notifications-editor-notification-edit__footer-submit"
					onClick={() => {
					if (isFormInValid) {
						setIsReviewing(true);
					} else {
						if (notificationId) {
							setNotificationProperties(
								notificationId,
								properties
							);
							if (onSuccess) onSuccess(__('Changes saved successfully', 'quillforms'));
						} else {
							addNewNotification(properties);
							if (onSuccess) onSuccess(__('Notification has been created', 'quillforms'));
						}
						goBack();
					}
					}}
				>
					{notificationId ? __('Save changes', 'quillforms') : __('Add new notification', 'quillforms')}
				</Button>
			)}
		</div>,
		document.querySelector('.builder-core-panel')
	);
};
export default NotificationEditorFooter;
