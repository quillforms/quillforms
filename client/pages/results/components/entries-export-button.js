/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/admin-components';
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

const EntriesExportButton = ({ selectedIds = [] }) => {
	const [visible, setVisible] = useState(false);

	return (
		<>
			<Button isPrimary isButton onClick={() => setVisible(true)}>
				{selectedIds?.length > 0
					? __('Download', 'quillforms')
					: __('Download all responses', 'quillforms')}
			</Button>
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
