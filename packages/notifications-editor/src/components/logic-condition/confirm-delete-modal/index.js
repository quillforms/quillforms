import { Modal } from '@wordpress/components';

const getTrashImageUrl = () => {
	if (typeof window === 'undefined') {
		return '/wp-content/plugins/quillforms/assets/images/trash.png';
	}
	const [adminBasePath] = window.location.pathname.split('/wp-admin');
	return `${adminBasePath}/wp-content/plugins/quillforms/assets/images/trash.png`;
};

const ConfirmDeleteModal = ({ title, message, onCancel, onConfirm }) => {
	return (
		<Modal
			className="logic-editor-confirm-delete-modal"
			onRequestClose={onCancel}
			title={title}
			shouldCloseOnClickOutside={false}
		>
			<div className="logic-editor-confirm-delete-modal__body">
				<div className="logic-editor-confirm-delete-modal__illustration">
					<img
						className="logic-editor-confirm-delete-modal__image"
						src={getTrashImageUrl()}
						alt=""
					/>
				</div>
				<p className="logic-editor-confirm-delete-modal__message">
					{message}
				</p>
				<footer className="logic-editor-confirm-delete-modal__footer">
					<div className="logic-editor-confirm-delete-modal__actions">
						<button
							type="button"
							className="logic-editor-confirm-delete-modal__btn logic-editor-confirm-delete-modal__btn--cancel"
							onClick={onCancel}
						>
							Cancel
						</button>
						<button
							type="button"
							className="logic-editor-confirm-delete-modal__btn logic-editor-confirm-delete-modal__btn--delete"
							onClick={onConfirm}
						>
							Delete
						</button>
					</div>
				</footer>
			</div>
		</Modal>
	);
};

export default ConfirmDeleteModal;
