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
	messages: string[];
	approve: () => void;
	reject: () => void;
	closeModal: () => void;
}
const DragAlertModal: React.FC< Props > = ( {
	messages,
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
			<div>
				<div>
					{ messages.length === 1
						? messages[ 0 ]
						: messages.map( ( message, index ) => (
								<div>{ `${ index + 1 }. ${ message }` }</div>
						  ) ) }
				</div>
				<br />
				<div>Are you sure you want to proceed?</div>
			</div>
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
