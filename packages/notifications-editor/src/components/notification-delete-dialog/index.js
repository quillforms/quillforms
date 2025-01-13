/**
 * QuillFomrs Dependencies
 */
import { Button } from '@quillforms/admin-components';
/**
 * WordPress Dependencies
 */
import { Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import classnames from 'classnames';
import { css } from 'emotion';

const NotificationDeleteDialog = ({ proceed, closeModal }) => {
	return (
		<Modal
			className={classnames(
				'qf-notification-delete-dialog',
				css`
					border: none !important;
				`
			)}
			title={__('Delete notification', 'quillforms')}
			onRequestClose={closeModal}
		>
			<div className="notifications-delete-dialog__body">
				{__('Are you sure you would like to delete this notification?', 'quillforms')}
			</div>
			<div className="notifications-delete-dialog__actions">
				<Button isDefault onClick={closeModal}>
					{__('Cancel', 'quillforms')}
				</Button>
				<Button isDanger onClick={proceed}>
					{__('Delete', 'quillforms')}
				</Button>
			</div>
		</Modal>
	);
};

export default NotificationDeleteDialog;
