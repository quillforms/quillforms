/**
 * QuillForms Dependencies
 */
import { __experimentalAddonFeatureAvailability } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useState } from '@wordpress/element';
import { Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { css } from 'emotion';
import DownloadIcon from '../../../components/icon/download-icon';

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
				` }
			>
				<span>{__('Download all', 'quillforms')}</span>
				<DownloadIcon/>
			</button>
			{visible && (
				<Modal
					className={css`
					border: none !important;
					border-radius: 9px;

					.components-modal__header {
						background: linear-gradient(
							42deg,
							rgb( 235 54 221 ),
							rgb( 238 142 22 )
						);
						h1 {
							color: #fff;
						}
						svg {
							fill: #fff;
						}
					}
					.components-modal__content {
						text-align: center;
					}
				` }
					title={__('Export responses is a pro feature', 'quillforms')}
					onRequestClose={() => {
						setVisible(false);
					}}
				>
					<__experimentalAddonFeatureAvailability
						featureName={__('Export Responses', 'quillforms')}
						addonSlug={'advancedentries'}
						showLockIcon={true}
					/>
				</Modal>
			)}
		</>
	);
};

export default EntriesExportButton;
