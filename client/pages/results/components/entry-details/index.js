/**
 * QuillForms Dependencies
 */
import { __experimentalAddonFeatureAvailability } from '@quillforms/admin-components';
import ConfigAPI from "@quillforms/config";

/**
 * WordPress Dependencies
 */
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __, sprintf } from '@wordpress/i18n';
import { Modal } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import DeleteIcon from '../delete-icon';
import DeleteAlertModal from '../delete-alert';
import Details from './details';
import Notes from './notes';
import UserSubmissionInfo from './user-submission-info';
import { css } from 'emotion';
import EyeIcon from '../../../../components/icon/eye-icon';
import UploadIcon from '../../../../components/icon/upload-icon';


export const EntryDetails = ({ recordsInfo, entry, formId, deleteEntry }) => {
	const [isDeleting, setIsDeleting] = useState(false);
	const [modelOpen, setModalOpen] = useState(false);
	const [notesModalOpen, setNotesModalOpen] = useState(false);
	const [pdfModalOpen, setPdfModalOpen] = useState(false);
	const isWPEnv = ConfigAPI.isWPEnv();

	const onDelete = () => {
		setIsDeleting(true);
		apiFetch({
			path: `/qf/v1/forms/${formId}/entries/${entry.ID}`,
			method: 'DELETE',
		}).then((res) => {
			if (res) {
				setIsDeleting(false);
				setModalOpen(false);
				deleteEntry(entry.ID);
			}
		});
	};

	const score = entry?.quiz_score ?? entry?.records?.score ?? null;

	return (
		<div className="qf-entry-details">
			{entry && (
				<>
					{/* ── Header ── */}
					<div className="qf-entry-details__header">
						<h2 className="qf-entry-details__title">
							{__('Details of ID:', 'quillforms')}
							<span className=" font-bold">{entry.ID}</span>
						</h2>

						<div className="qf-entry-details__actions">
							<button
								type="button"
								className="qf-entry-details__action-btn"
								onClick={() => setNotesModalOpen(true)}
							>
								{__('All Notes', 'quillforms')}
								<EyeIcon />
							</button>

							<span className="qf-entry-details__actions-divider" />

							<button
								type="button"
								className="qf-entry-details__action-btn"
								onClick={() => setPdfModalOpen(true)}
							>
								{__('PDF Export', 'quillforms')}
								<UploadIcon width={24} height={24} />
							</button>

							{/* <div
								className="qf-entry-details__delete-entry"
								onClick={() => setModalOpen(true)}
							>
								<DeleteIcon />
							</div> */}
						</div>
					</div>

					{/* ── User Info ── */}
					{isWPEnv && <UserSubmissionInfo entry={entry} />}

					{/* ── All Questions + Score ── */}
					{recordsInfo && (
						<>
							<div className="qf-entry-details__section-row">
								<span className="qf-entry-details__section-title">
									{__('All Questions', 'quillforms')}
								</span>
								{score !== null && (
									<span className="qf-entry-details__score-badge">
										{__('Score:', 'quillforms')} {score}
									</span>
								)}
							</div>

							{/* ── Fields list (cards) ── */}
							<Details recordsInfo={recordsInfo} entry={entry} />
						</>
					)}

					{/* ── Modals ── */}
					{notesModalOpen && (
						<Modal
							title={sprintf(
								/* translators: %s: entry id */
								__('Notes of ID: %s', 'quillforms'),
								entry?.ID ?? ''
							)}
							onRequestClose={() => setNotesModalOpen(false)}
							className={css`
								border: none !important;
								color: #334155;
								font-size: 24px;
								font-weight: 500;
								border-radius: 16px;
								min-width: 700px;
								.components-modal__header {
									border-bottom: 1px solid #E2E8F0;
									padding: 16px 24px;
								}
								.components-modal__content {
									padding: 0 24px 24px;
								}
							`}
						>
							<div className="qf-entry-notes-modal">
								<div className="qf-entry-notes-modal__card">
									<Notes entry={entry} />
								</div>
							</div>
						</Modal>
					)}

					{pdfModalOpen && (
						<Modal
							title={__('PDF Export', 'quillforms')}
							onRequestClose={() => setPdfModalOpen(false)}
							className={css`
								border: none !important;
								border-radius: 12px;
								.components-modal__header {
									background: linear-gradient(42deg, rgb(235 54 221), rgb(238 142 22));
									h1 { color: #fff; }
									svg { fill: #fff; }
								}
								.components-modal__content {
									text-align: center;
								}
							`}
						>
							<__experimentalAddonFeatureAvailability
								featureName={__("PDF Export", "quillforms")}
								addonSlug={"pdf"}
								showLockIcon={true}
							/>
						</Modal>
					)}

					{modelOpen && (
						<DeleteAlertModal
							isDeleting={isDeleting}
							closeModal={() => setModalOpen(false)}
							approve={() => onDelete()}
						/>
					)}
				</>
			)}
		</div>
	);
};
