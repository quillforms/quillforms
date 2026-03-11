/**
 * WordPress Dependencies
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import CustomModal from '../../../components/custom-modal';
import CustomButton from '../../../components/custom-button';
import trashImage from '../../../../assets/images/trash.png';
import AlertIcon from '../../../components/icon/alert-icon';

const DeleteAlertModal = ({ approve, closeModal, isDeleting }) => {
	const [confirmText, setConfirmText] = useState('');
	const isConfirmed = confirmText === 'Confirm';

	return (
		<CustomModal
			isOpen={true}
			onClose={closeModal}
			title={__('Delete this response', 'quillforms')}
			centerTitle={true}
			noBorder={true}
		>
			<div className="flex flex-col items-center text-center gap-4">
				{/* Trash image */}
				<img
					src={trashImage}
					alt={__('Delete', 'quillforms')}
					className={css`

						object-fit: contain;
						margin: 0 auto;
						display: block;
					`}
				/>

				{/* Warning text */}
				<p
					className={css`
						font-size: 18px;
						line-height: 28px;
						color: #777;
						font-weight: 500;
						margin: 0;

					`}
				>
					{__(
						"Are you sure want to delete the selected response? This action cannot be undone.",
						'quillforms'
					)}
				</p>

				{/* Confirm input */}
				<input
					type="text"
					value={confirmText}
					onChange={(e) => setConfirmText(e.target.value)}
					placeholder={__('Type here', 'quillforms')}
					className={css`
						width: 100%;
						border: 1px solid #D9D9D9 !important;
						border-radius: 16px !important;
						padding: 12px 16px !important;
						font-size: 16px;
						color: #334155;
						outline: none;
						transition: border-color 0.2s;
						&:focus {
							border-color: #B2328C;
						}
					`}
				/>

				{/* Hint */}
				<p
					className={css`
						display: flex;
						align-items: center;
						gap: 4px;
						font-size: 16px;
						line-height: 26px;
						font-weight: 500;
						color: #E13B3B;
						align-self: flex-start;
					`}
				>
					<AlertIcon width={24} height={24} color='#E13B3B' />
					{__('Type "Confirm" to delete this response', 'quillforms')}
				</p>

				{/* Action buttons */}
				<div
					className={css`
						display: flex;
						justify-content: flex-end;
						gap: 24px;
						width: 100%;

					`}
				>
					<CustomButton
						text={__('Cancel', 'quillforms')}
						variant="outlineSecondary"
						onClick={closeModal}
						className={css`
							padding: 8px 12px !important;
							border-radius: 8px !important;
						`}
					/>
					<CustomButton
						text={isDeleting ? __('Deleting...', 'quillforms') : __('Delete', 'quillforms')}
						variant="danger"
						onClick={() => {
							if (isConfirmed && !isDeleting) approve();
						}}
						disabled={!isConfirmed || isDeleting}
						className={css`
							padding: 8px 12px !important;
							border-radius: 8px !important;
							opacity: ${!isConfirmed || isDeleting ? '0.5' : '1'};
							cursor: ${!isConfirmed || isDeleting ? 'not-allowed' : 'pointer'};
						`}
					/>
				</div>
			</div>
		</CustomModal>
	);
};

export default DeleteAlertModal;
