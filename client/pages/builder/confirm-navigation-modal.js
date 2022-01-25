import { Modal } from '@wordpress/components';
import { css } from 'emotion';
import { Button } from '@quillforms/admin-components';
const ConfirmNavigationModal = ( { onCancel, onConfirm } ) => {
	return (
		<Modal
			className={ css`
				border: none !important;
				border-radius: 9px;

				.components-modal__header {
					background: #c5152b;
					h1 {
						color: #fff;
					}
					svg {
						fill: #fff;
					}
				}
			` }
			title="Leave Page"
			focusOnMount={ true }
			onRequestClose={ onCancel }
		>
			<div> You have unsaved changes, leave page?</div>
			<div
				className={ css`
					display: flex;
					justify-content: flex-end;
					margin-top: 30px;
				` }
			>
				<Button
					isDefault
					className={ css`
						margin-right: 10px !important;
					` }
					onClick={ onCancel }
				>
					Cancel
				</Button>
				<Button
					className={ css`
						width: 70px;
						display: flex;
						justify-content: center;
						align-items: center;
					` }
					onClick={ onConfirm }
					isPrimary
				>
					Leave
				</Button>
			</div>
		</Modal>
	);
};

export default ConfirmNavigationModal;
