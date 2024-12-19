/**
 * QuillForms Dependencies
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

const DeleteAlertModal = ( { approve, closeModal, isDeleting } ) => {
	return (
		<Modal
			className={ classnames(
				'qf-entry-delete-alert-modal',
				css`
					border: none !important;
					min-width: 420px !important;
					max-width: 470px !important;
					border-radius: 10px;
					z-index: 1111111;

					.components-modal__header {
						background: #c5152b;
						.components-modal__header-heading {
							color: #fff;
						}
						.components-button.has-icon svg {
							fill: #fff;
						}
					}
				`
			) }
			// Because focus on editor is causing the click handler to be triggered
			shouldCloseOnClickOutside={ false }
			title="Warning!"
			onRequestClose={ closeModal }
		>
			<div>Are you sure you want to proceed?</div>
			<div
				className={ css`
					display: flex;
					margin-top: 10px;
					justify-content: flex-end;
				` }
			>
				<Button
					isDefault
					isLarge
					className={ css`
						margin-right: 10px !important;
					` }
					onClick={ () => {
						closeModal();
					} }
				>
					Cancel
				</Button>
				{ isDeleting ? (
					<Button
						isLarge
						className={ css`
							width: 70px;
							display: flex;
							justify-content: center;
							align-items: center;
						` }
						isPrimary
					>
						Deleting...
					</Button>
				) : (
					<Button
						isLarge
						className={ css`
							width: 70px;
							display: flex;
							justify-content: center;
							align-items: center;
						` }
						onClick={ () => {
							approve();
						} }
						isPrimary
					>
						Proceed
					</Button>
				) }
			</div>
		</Modal>
	);
};

export default DeleteAlertModal;
