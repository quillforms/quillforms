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

interface Props {
	approve: () => void;
	reject: () => void;
	closeModal: () => void;
}
const DragAlertModal: React.FC< Props > = ( {
	approve,
	reject,
	closeModal,
} ) => {
	return (
		<Modal
			className={ classnames(
				'builder-core-drag-alert-modal',
				css`
					border: none !important;
					min-width: 420px !important;
					max-width: 470px !important;
					border-radius: 10px;
					z-index: 1111111;
				`
			) }
			// Because focus on editor is causing the click handler to be triggered
			shouldCloseOnClickOutside={ false }
			title="Warning!"
			onRequestClose={ closeModal }
		>
			<p>
				This block recalls information from previous fields. This info
				will be lost if you proceed with this block movement.
				<br />
				<br /> Are you sure you want to proceed?
			</p>
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
						reject();
					} }
				>
					Cancel
				</Button>
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
			</div>
		</Modal>
	);
};

export default DragAlertModal;
