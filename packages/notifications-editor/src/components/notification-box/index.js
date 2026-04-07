import { ToggleControl } from '@quillforms/admin-components';
import { useDispatch } from '@wordpress/data';
import { useState, useEffect, useRef } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { css } from 'emotion';
import classnames from 'classnames';
import NotificationDeleteDialog from '../notification-delete-dialog';
import NotificationIcon from '../icons/notification';
import { __ } from '@wordpress/i18n';

const NotificationBox = ({ notification, onEdit, index }) => {
	const [isMounted, setIsMounted] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef(null);

	useEffect(() => {
		setTimeout(() => setIsMounted(true), 50);
	}, []);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (menuRef.current && !menuRef.current.contains(e.target)) {
				setMenuOpen(false);
			}
		};
		if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [menuOpen]);

	const {
		properties: { title, active },
		id,
	} = notification;

	const { setNotificationProperties, deleteNotification } = useDispatch('quillForms/notifications-editor');

	return (
		<div className="notifications-editor-notification-box-container">
		<div
			className={classnames(
				'notifications-editor-notification-box',
				css`
					opacity: 0;
					transform: scale(0.6);
					transition: all 0.3s ease;
					transition-delay: ${index * 0.05}s;
					&.mounted {
						opacity: 1;
						transform: scale(1);
					}
				`,
				{ mounted: isMounted }
			)}
		>
			<div className="notifications-editor-notification-box__left">
				<NotificationIcon width={24} height={24} color="#334155" />
				<span className="notifications-editor-notification-box__title-text">
					{title ? title : __('Notification Title', 'quillforms')}
				</span>
			</div>
			<div className="notifications-editor-notification-box__right">
				<ToggleControl
					checked={active}
					onChange={() => {
						setNotificationProperties(id, { active: !active });
					}}
				/>
				<div className='divider'></div>


				<div className="notifications-editor-notification-box__menu-wrap" ref={menuRef}>
					<button
						className="notifications-editor-notification-box__dots"
						onClick={() => setMenuOpen((v) => !v)}
						aria-label="Actions"
					>
						<span />
						<span />
						<span />
					</button>
					{menuOpen && (
						<div className="notifications-editor-notification-box__dropdown">
							<button
								className="notifications-editor-notification-box__dropdown-item"
								onClick={() => { setMenuOpen(false); onEdit(); }}
							>
								{__('Edit', 'quillforms')}
							</button>
							<button
								className="notifications-editor-notification-box__dropdown-item is-delete"
								onClick={() => {
									setMenuOpen(false);
									confirmAlert({
										customUI: ({ onClose }) => (
											<NotificationDeleteDialog
												closeModal={onClose}
												proceed={() => {
													deleteNotification(id);
													onClose();
												}}
											/>
										),
									});
								}}
							>
								{__('Delete', 'quillforms')}
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
		</div>
	);
};

export default NotificationBox;
