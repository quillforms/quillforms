/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/builder-components';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * External Dependencies
 */
import { css } from 'emotion';
/**
 * Internal Dependencies
 */
import NotificationBox from '../notification-box';

const NotificationsList = ( { sliderRef } ) => {
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
				<div
					className={ css`
						margin: 10px 0 !important;
						text-align: right;
					` }
				>
					<Button
						className={ css`
							border-radius: 8px !important;
						` }
						isPrimary
						onClick={ () => {
							sliderRef.current.slickNext();
						} }
						isLarge
					>
						Add New Notification
					</Button>
				</div>
				{ notifications.map( ( notification ) => {
					return (
						<NotificationBox
							onEdit={ () => {
								sliderRef.current.slickNext();
							} }
							key={ notification.id }
							notification={ notification }
						/>
					);
				} ) }
			</>
		</div>
	);
};

export default NotificationsList;
