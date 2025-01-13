/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
import { createPortal } from 'react-dom';
import { Icon } from '@wordpress/components';
import { arrowLeft } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { css } from 'emotion';

const NotificationEditorFooter = ({
	goBack,
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
				onClick={() => {
					goBack();
				}}
			>
				<Icon
					icon={arrowLeft}
					className={css`
						margin-right: 5px;
					` }
				/>
				{__('Cancel and go back', 'quillforms')}
			</Button>
			{isReviewing && isFormInValid ? (
				<Button isDanger>{__('Some fields aren\'t valid', 'quillforms')} </Button>
			) : (
				<Button
					isPrimary
					onClick={() => {
						if (isFormInValid) {
							setIsReviewing(true);
						} else {
							if (notificationId) {
								setNotificationProperties(
									notificationId,
									properties
								);
							} else {
								addNewNotification(properties);
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
