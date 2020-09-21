/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/builder-components';

/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
import { createPortal } from '@wordpress/element';
import { Icon, arrowLeft } from '@wordpress/icons';

/**
 * External Dependencies
 */
import { css } from 'emotion';

const NotificationEditorFooter = ( {
	sliderRef,
	notificationId,
	properties,
} ) => {
	const { setNotificationProperties, addNewNotification } = useDispatch(
		'quillForms/notifications-editor'
	);
	return createPortal(
		<div className="notifications-editor-notification-edit__footer">
			<Button
				isDefault
				className={ css`
					width: 50%;
					padding: 20px !important;
					justify-content: center;
					align-items: center;
					border-radius: 0 !important;
				` }
				onClick={ () => {
					sliderRef.current.slickPrev();
				} }
			>
				<Icon
					icon={ arrowLeft }
					className={ css`
						margin-right: 5px;
					` }
				/>
				Cancel and go back
			</Button>
			<Button
				isPrimary
				className={ css`
					width: 50%;
					padding: 20px !important;
					justify-content: center;
					align-items: center;
					border-radius: 0 !important;
				` }
				onClick={ () => {
					if ( notificationId ) {
						setNotificationProperties( notificationId, properties );
					} else {
						addNewNotification( properties );
					}
					sliderRef.current.slickPrev();
				} }
			>
				{ notificationId ? 'Save changes' : 'Add new notification' }
			</Button>
		</div>,
		document.querySelector( '.builder-core-panel' )
	);
};
export default NotificationEditorFooter;
