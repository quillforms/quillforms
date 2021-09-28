/**
 * QuillForms Dependecies
 */
import { ToggleControl } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';

/**
 * External Dependencies
 */
import { confirmAlert } from 'react-confirm-alert';
import { css } from 'emotion';
import classnames from 'classnames';
import NotificationDeleteDialog from '../notification-delete-dialog';

const NotificationBox = ( { notification, onEdit, index } ) => {
	const [ isMounted, setIsMounted ] = useState( false );
	useEffect( () => {
		setTimeout( () => {
			setIsMounted( true );
		}, 50 );
	}, [] );

	const {
		properties: { title, active },
		id,
	} = notification;
	const { setNotificationProperties, deleteNotification } = useDispatch(
		'quillForms/notifications-editor'
	);

	return (
		<div
			className={ classnames(
				'notifications-editor-notification-box',
				css`
					opacity: 0;
					transform: scale( 0.6 );
					transition: all 0.3s ease;
					transition-delay: ${ index * 0.05 }s;

					&.mounted {
						opacity: 1;
						transform: scale( 1 );
					}
				`,
				{
					mounted: isMounted,
				}
			) }
		>
			<div className="notifications-editor-notification-box__title">
				<div className="notifications-editor-notification-box__status">
					<ToggleControl
						checked={ active }
						onChange={ () => {
							setNotificationProperties( id, {
								active: ! active,
							} );
						} }
					/>
				</div>
				{ title ? title : 'Untitled' }
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
					onClick={ () => {
						confirmAlert( {
							customUI: ( { onClose } ) => {
								return (
									<NotificationDeleteDialog
										closeModal={ () => {
											onClose();
										} }
										proceed={ () => {
											deleteNotification( id );
											onClose();
										} }
									/>
								);
							},
						} );
					} }
				>
					Delete
				</div>
			</div>
		</div>
	);
};

export default NotificationBox;
