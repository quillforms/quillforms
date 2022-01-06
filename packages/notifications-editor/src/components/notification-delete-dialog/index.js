/**
 * QuillFomrs Dependencies
 */
import { Button } from '@quillforms/admin-components';
/**
 * WordPress Dependencies
 */
import { Modal } from '@wordpress/components';

/**
 * External Dependencies
 */
import classnames from 'classnames';
import { css } from 'emotion';

const NotificationDeleteDialog = ( { proceed, closeModal } ) => {
	return (
		<Modal
			className={ classnames(
				'qf-notification-delete-dialog',
				css`
					border: none !important;
				`
			) }
			title="Delete notification"
			onRequestClose={ closeModal }
		>
			<div className="notifications-delete-dialog__body">
				Are you sure you would like to delete this notification?
			</div>
			<div className="notifications-delete-dialog__actions">
				<Button isDefault onClick={ closeModal }>
					Cancel
				</Button>
				<Button isDanger onClick={ proceed }>
					Delete
				</Button>
			</div>
		</Modal>
	);
};

export default NotificationDeleteDialog;
