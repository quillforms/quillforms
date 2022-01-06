/**
 * QuillForms Dependencies
 */
import {
	Button,
	__experimentalFeatureAvailability,
} from '@quillforms/admin-components';
import ConfigAPI from '@quillforms/config';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { Icon, arrowRight } from '@wordpress/icons';
import { useState } from '@wordpress/element';
import { Modal } from '@wordpress/components';

/**
 * External Dependencies
 */
import classnames from 'classnames';
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import NotificationBox from '../notification-box';

const NotificationsList = ( {
	goNext,
	setCurrentNotificationId,
	isActive,
	isAnimating,
} ) => {
	const [ displayProModal, setDisplayProModal ] = useState( false );
	const license = ConfigAPI.getLicense();
	const { notifications } = useSelect( ( select ) => {
		return {
			notifications: select(
				'quillForms/notifications-editor'
			).getNotifications(),
		};
	} );
	return (
		<div
			className={ classnames( 'notifications-editor-notifciations-list', {
				active: isActive,
				'is-animating': isAnimating,
			} ) }
		>
			<div className="notifications-editor-notifciations-list__header">
				<h4
					className={ css`
						font-size: 15px;
					` }
				>
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
						if (
							notifications.length > 0 &&
							license?.status !== 'valid'
						) {
							setDisplayProModal( true );
						} else {
							setCurrentNotificationId( null );
							goNext();
						}
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
			<>
				{ notifications?.length > 0 ? (
					notifications.map( ( notification, index ) => {
						return (
							<NotificationBox
								index={ index }
								onEdit={ () => {
									setCurrentNotificationId( notification.id );
									goNext();
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
			<>
				{ displayProModal && (
					<Modal
						className={ classnames(
							css`
								border: none !important;
								border-radius: 9px;

								.components-modal__header {
									background: linear-gradient(
										42deg,
										rgb( 235 54 221 ),
										rgb( 238 142 22 )
									);
									h1 {
										color: #fff;
									}
									svg {
										fill: #fff;
									}
								}
								.components-modal__content {
									text-align: center;
								}
							`
						) }
						title="Multiple notifications is a pro feature"
						onRequestClose={ () => {
							setDisplayProModal( false );
						} }
					>
						<__experimentalFeatureAvailability
							featureName="Multiple notifications"
							planKey="basic"
							showLockIcon={ true }
						/>
					</Modal>
				) }
			</>
		</div>
	);
};

export default NotificationsList;
