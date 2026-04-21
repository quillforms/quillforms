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
import { useState } from 'react';
import { Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import classnames from 'classnames';
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import NotificationBox from '../notification-box';
import AlertMessageWrapper from '../alert-message-wrapper';
import PlusIcon from '../icons/plus';
import NotificationIcon from '../icons/notification';

const NotificationsList = ({
	goNext,
	setCurrentNotificationId,
	isActive,
	isAnimating,
	successToast,
	onDismissToast,
}) => {
	const [displayProModal, setDisplayProModal] = useState(false);
	const license = ConfigAPI.getLicense();
	const isWPEnv = ConfigAPI.isWPEnv();
	const { notifications } = useSelect((select) => {
		return {
			notifications: select(
				'quillForms/notifications-editor'
			).getNotifications(),
		};
	});
	return (
		<div
			className={classnames('notifications-editor-notifciations-list', {
				active: isActive,
				'is-animating': isAnimating,
			})}
		>
			{isWPEnv && (!qfAdmin.is_quill_smtp_installed || !qfAdmin.is_quill_smtp_active) && (
				<AlertMessageWrapper type={"info"}>
					{!qfAdmin.is_quill_smtp_installed &&
						<>
							{__('Email Notifications requires Quill SMTP plugin to be installed and activated. Please install and activate', 'quillforms')} <a href={`${qfAdmin.adminUrl}plugin-install.php?s=quillsmtp&tab=search&type=term`} target="_blank">{__('Quill SMTP', 'quillforms')}</a> {__('plugin to make sure that your email notifications are delivered successfully.', 'quillforms')}
						</>
					}
					{qfAdmin.is_quill_smtp_installed && !qfAdmin.is_quill_smtp_active &&
						<>
							{__('Email Notifications requires Quill SMTP plugin to be activated. Please activate', 'quillforms')} <a href={`${qfAdmin.adminUrl}plugin-install.php?s=quillsmtp&tab=search&type=term`} target="_blank">{__('Quill SMTP', 'quillforms')}</a> {__('plugin to make sure that your email notifications are delivered successfully.', 'quillforms')}
						</>
					}
				</AlertMessageWrapper>
			)}
			<div className="notifications-editor-notifciations-list__header">
				<h4
					className={css`
						font-size: 14px;
						font-weight: 500;
						line-height: 1.4;
						color: #777;
					` }
				>
					{__('Notifications List', 'quillforms')}
				</h4>

				<Button
					className= 'notifications-editor-notifciations-add-new-button'
					onClick={() => {
						if (
							notifications.length > 0 &&
							license?.status !== 'valid' &&
							isWPEnv
						) {
							setDisplayProModal(true);
						} else {
							setCurrentNotificationId(null);
							goNext();
						}
					}}
					isLarge
				>
					<PlusIcon color="#fff" />
					{__('Create a new notification', 'quillforms')}

				</Button>
			</div>
			<>
				{notifications?.length > 0 ? (
					notifications.map((notification, index) => {
						return (
							<NotificationBox
								index={index}
								onEdit={() => {
									setCurrentNotificationId(notification.id);
									goNext();
								}}
								key={notification.id}
								notification={notification}
							/>
						);
					})
				) : (
					<div className="notifications-editor-no-notifications-msg">
						<NotificationIcon/>
						<p>{__('Nothing to see here yet. Notifications will show up when they’re ready', 'quillforms')}</p>
						<Button
					className= 'notifications-editor-notifciations-add-new-button'
					onClick={() => {
						if (
							notifications.length > 0 &&
							license?.status !== 'valid' &&
							isWPEnv
						) {
							setDisplayProModal(true);
						} else {
							setCurrentNotificationId(null);
							goNext();
						}
					}}
					isLarge
				>
					<PlusIcon color="#fff" />
					{__('Create a new notification', 'quillforms')}

				</Button>

					</div>
				)}
			</>
		{successToast && (
			<div className="notifications-editor-success-toast">
				<span className="notifications-editor-success-toast__icon">
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
						<circle cx="10" cy="10" r="10" fill="#22c55e" fillOpacity="0.15"/>
						<path d="M6 10.5L8.5 13L14 7.5" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
					</svg>
				</span>
				<span className="notifications-editor-success-toast__text">
					{__('Success!', 'quillforms')} {successToast}
				</span>
				<button className="notifications-editor-success-toast__close" onClick={onDismissToast}>✕</button>
			</div>
		)}
		<>
			{displayProModal && (
					<Modal
						className={classnames(
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
						)}
						title={__('Multiple notifications is a pro feature', 'quillforms')}
						onRequestClose={() => {
							setDisplayProModal(false);
						}}
					>
						<__experimentalFeatureAvailability
							featureName="Multiple notifications"
							planKey="basic"
							showLockIcon={true}
						/>
					</Modal>
				)}
			</>
		</div>
	);
};

export default NotificationsList;
