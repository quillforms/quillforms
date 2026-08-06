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

const NotificationsList = ({
	goNext,
	setCurrentNotificationId,
	isActive,
	isAnimating,
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
			{isWPEnv && (!qfAdmin.is_doublescale_installed || !qfAdmin.is_doublescale_active) && (
				<AlertMessageWrapper type={"info"}>
					{!qfAdmin.is_doublescale_installed &&
						<>
							{__('Email Notifications require our partner plugin DoubleScale to be installed and activated to deliver your emails reliably. Please install and activate', 'quillforms')} <a href={qfAdmin.doublescale_wporg_url || 'https://wordpress.org/plugins/doublescale/'} target="_blank" rel="noopener noreferrer">{__('DoubleScale', 'quillforms')}</a> {__('to make sure that your email notifications are delivered successfully.', 'quillforms')}
						</>
					}
					{qfAdmin.is_doublescale_installed && !qfAdmin.is_doublescale_active &&
						<>
							{__('Email Notifications require our partner plugin DoubleScale to be activated to deliver your emails reliably. Please activate', 'quillforms')} <a href={`${qfAdmin.adminUrl}plugins.php`} target="_blank" rel="noopener noreferrer">{__('DoubleScale', 'quillforms')}</a> {__('to make sure that your email notifications are delivered successfully.', 'quillforms')}
						</>
					}
				</AlertMessageWrapper>
			)}
			{isWPEnv && qfAdmin.is_doublescale_active && qfAdmin.is_doublescale_smtp_module_active && !qfAdmin.doublescale_smtp_has_connections && (
				<AlertMessageWrapper type={"error"}>
					{__('The DoubleScale SMTP module is enabled but no email connection has been configured yet. Your email notifications will not be delivered until you add at least one SMTP connection in', 'quillforms')} <a href={qfAdmin.doublescale_smtp_settings_url || '#'} target="_blank" rel="noopener noreferrer">{__('DoubleScale SMTP settings', 'quillforms')}</a>{__('.', 'quillforms')}
				</AlertMessageWrapper>
			)}
			<div className="notifications-editor-notifciations-list__header">
				<h4
					className={css`
						font-size: 15px;
					` }
				>
					{__('Notifications List', 'quillforms')}
				</h4>

				<Button
					className={css`
						border-radius: 8px !important;
						display: inlinep-flex;
						align-items: center;
					` }
					isPrimary
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
					{__('Add New Notification', 'quillforms')}
					<Icon
						className={css`
							fill: #fff;
							margin-left: 5px;
						` }
						icon={arrowRight}
						size={15}
					/>
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
						{__('There are no notifications.', 'quillforms')}
					</div>
				)}
			</>
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
