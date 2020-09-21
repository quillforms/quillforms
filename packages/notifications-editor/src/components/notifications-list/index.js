/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/builder-components';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { Icon, arrowRight } from '@wordpress/icons';

/**
 * External Dependencies
 */
import { css } from 'emotion';
/**
 * Internal Dependencies
 */
import NotificationBox from '../notification-box';

const NotificationsList = ( { sliderRef, setCurrentNotificationId } ) => {
	const { notifications } = useSelect( ( select ) => {
		return {
			notifications: select(
				'quillForms/notifications-editor'
			).getNotifications(),
		};
	} );
	return (
		<div className="notifications-editor-notifciations-list">
			<>
				<div className="notifications-editor-notifciations-list__header">
					<h4
						className={ css`
							font-size: 15px;
						` }
					>
						{ ' ' }
						Notifications List
					</h4>

					<Button
						className={ css`
							border-radius: 8px !important;
							display: inlinep-flex;
							align-items: center;
						` }
						isPrimary
						onClick={ () => {
							setCurrentNotificationId( null );
							sliderRef.current.slickNext();
						} }
						isLarge
					>
						Add New Notification
						<Icon
							className={ css`
								fill: #fff;
								margin-left: 5px;
							` }
							icon={ arrowRight }
							size={ 15 }
						/>
					</Button>
				</div>
				{ notifications?.length > 0 ? (
					notifications.map( ( notification ) => {
						return (
							<NotificationBox
								onEdit={ () => {
									setCurrentNotificationId( notification.id );
									sliderRef.current.slickNext();
								} }
								key={ notification.id }
								notification={ notification }
							/>
						);
					} )
				) : (
					<div className="notifications-editor-no-notifications-msg">
						There are no notifications.
					</div>
				) }
			</>
		</div>
	);
};

export default NotificationsList;
