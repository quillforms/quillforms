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
import DownloadIcon from '../../../components/icon/download-icon';
import CustomModal from '../../../components/custom-modal';
import CustomButton from '../../../components/custom-button';
import lockImage from '../../../../assets/images/lock.png';

const EntriesExportButton = ({ selectedIds = [] }) => {
	const [visible, setVisible] = useState(false);

	return (
		<>
			<button
				type="button"
				onClick={() => setVisible(true)}
				className={css`
					display: inline-flex;
					align-items: center;
					gap: 8px;
					padding: 0;
					margin: 0;
					background: transparent;
					border: none;
					color: #b2328c;
					font-size: 18px;
					font-weight: 600;
					line-height: 28px;
					cursor: pointer;

					&:hover {
						color: #8d246c;
					}
				`}
			>
				<span>{__('Download all', 'quillforms')}</span>
				<DownloadIcon />
			</button>

			<CustomModal
				isOpen={visible}
				onClose={() => setVisible(false)}
				title={__('Export Responses is a pro feature', 'quillforms')}
				centerTitle={true}
				noBorder={true}
			>
				<div className="flex flex-col items-center text-center gap-4">
					<img
						src={lockImage}
						alt={__('Lock', 'quillforms')}
						className={css`

							object-fit: contain;
							margin: 0 auto;
							display: block;
						`}
					/>
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
							"We're sorry, Export Responses is not available on your plan. Please upgrade to the Basic plan to unlock all of Basic features",
							'quillforms'
						)}
					</p>
					<CustomButton
						text={__('Upgrade to Basic!', 'quillforms')}
						variant="primary"
						onClick={() => {
							window.open('https://quillforms.com/pricing', '_blank');
						}}
						className={css`
							font-size: 18px !important;
							padding: 12px 96px !important;
							border-radius: 16px !important;
						`}
					/>
				</div>
			</CustomModal>
		</>
	);
};

export default EntriesExportButton;
