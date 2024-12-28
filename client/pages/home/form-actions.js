/**
 * QuillForms Dependencies
 */
import { getNewPath, getHistory } from '@quillforms/navigation';
import { TextControl, Button } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { DropdownMenu, MenuItem, MenuGroup, Modal } from '@wordpress/components';
import { moreHorizontal } from '@wordpress/icons';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';

/**
 * External Dependencies
 */
import classnames from 'classnames';
import { css } from 'emotion';

const FormActions = ({ form, formId, setIsLoading }) => {
	const { deleteEntityRecord, editEntityRecord, saveEditedEntityRecord } = useDispatch('core');
	const { createErrorNotice, createSuccessNotice } =
		useDispatch('core/notices');
	const { invalidateResolution } = useDispatch('core/data');
	const [showRenameForm, setShowRenameForm] = useState(false);
	const [formTitle, setFormTitle] = useState(form.title.raw);
	const [editSlug, setEditSlug] = useState(false);
	const [formSlug, setFormSlug] = useState(form.slug);

	const duplicate = async () => {
		const data = new FormData();
		data.append('action', 'quillforms_duplicate_form');
		data.append('form_id', formId);
		data.append('_nonce', window.qfAdmin.duplicate_nonce);

		await fetch(`${window.qfAdmin.adminUrl}admin-ajax.php`, {
			method: 'POST',
			credentials: 'same-origin',
			body: data,
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.success) {
					invalidateResolution('core', 'getEntityRecords', [
						'postType',
						'quill_forms',
						{
							status: 'publish,draft',
							per_page: -1,
						},
					]);
				} else {
					createErrorNotice(`⛔ Can't duplicate form`, {
						type: 'snackbar',
						isDismissible: true,
					});
				}
			})
			.catch((err) => {
				createErrorNotice(`⛔ ${err ?? 'Error'}`, {
					type: 'snackbar',
					isDismissible: true,
				});
			});
	};

	return (
		<div
			role="presentation"
			className="quillforms-home-form-actions"
			onClick={(e) => e.stopPropagation()}
		>
			<DropdownMenu
				icon={moreHorizontal}
				className="quillforms-home-form-actions__dropdown"
			>
				{({ onClose }) => (
					<MenuGroup className="quillforms-home-form-actions__menu-group">
						<MenuItem
							className="quillforms-home-form-actions__menu-item"
							onClick={() => {
								const history = getHistory();
								history.push(
									getNewPath(
										{},
										`/forms/${formId}/builder`
									)
								);
							}}
						>
							Edit
						</MenuItem>
						<MenuItem
							className="quillforms-home-form-actions__menu-item"
							onClick={async () => {
								setIsLoading(true);
								await duplicate();
								setIsLoading(false);
								onClose();
							}}
						>
							Duplicate
						</MenuItem>
						<MenuItem
							className="quillforms-home-form-actions__menu-item"
							onClick={() => {
								const history = getHistory();
								history.push(
									getNewPath(
										{},
										`/forms/${formId}/results`
									)
								);
							}}
						>
							Results
						</MenuItem>
						<MenuItem
							className="quillforms-home-form-actions__menu-item"
							onClick={() => {
								const history = getHistory();
								history.push(
									getNewPath(
										{},
										`/forms/${formId}/integrations`
									)
								);
							}}
						>
							Integrations
						</MenuItem>
						<MenuItem
							className="quillforms-home-form-actions__menu-item"
							onClick={() => {
								const history = getHistory();
								history.push(
									getNewPath(
										{},
										`/forms/${formId}/share`
									)
								);
							}}
						>
							Share
						</MenuItem>
						{/*<!-- Rename the form-->*/}
						<MenuItem
							className="quillforms-home-form-actions__menu-item"
							onClick={() => {
								setShowRenameForm(true);
								onClose();
							}}
						>
							Rename
						</MenuItem>
						{/*<!-- Change the form slug-->*/}
						<MenuItem
							className="quillforms-home-form-actions__menu-item"
							onClick={() => {
								setEditSlug(true);
								onClose();
							}}
						>
							Change slug
						</MenuItem>
						<MenuItem
							className="quillforms-home-form-actions__menu-item"
							onClick={async () => {
								setIsLoading(true);
								const newStatus = form.status === 'publish' ? 'draft' : 'publish';
								//console.log(editEntityRecord)
								editEntityRecord('postType', 'quill_forms', formId, { status: newStatus });
								const res = await saveEditedEntityRecord('postType', 'quill_forms', formId);
								if (!res) {
									createErrorNotice(
										'⛔ Errror!',
										{
											type: 'snackbar',
											isDismissible: true,
										}
									);
									setIsLoading(false);
								} else {
									createSuccessNotice(
										`✅ Form status changed to ${newStatus} successfully!`,
										{
											type: 'snackbar',
											isDismissible: true,
										}
									);
								}
								onClose();
							}}
						>
							{form.status === 'publish' ? 'Move to draft' : 'Publish'}
						</MenuItem>


						<MenuItem
							className={classnames(
								'quillforms-home-form-actions__menu-item quillforms-home-form-actions__delete-form',
								css`
									.components-menu-item__item {
										color: #b71717 !important;
									}
								`
							)}
							onClick={async () => {
								onClose();
								if (
									!confirm(
										'Are you sure you want to move this form to trash?'
									)
								) {
									return;
								}
								setIsLoading(true);
								const res = await deleteEntityRecord(
									'postType',
									'quill_forms',
									formId
								);
								if (!res) {
									createErrorNotice(
										'⛔ Errror in form deletion!',
										{
											type: 'snackbar',
											isDismissible: true,
										}
									);
									setIsLoading(false);
								} else {
									createSuccessNotice(
										'✅ Form moved to trash successfully!',
										{
											type: 'snackbar',
											isDismissible: true,
										}
									);
								}
							}}
						>
							Move to trash
						</MenuItem>
					</MenuGroup>

				)}
			</DropdownMenu>
			{showRenameForm && (
				<Modal
					title="Rename Form"
					onRequestClose={() => setShowRenameForm(false)}
				>
					<TextControl
						type="text"
						className="quillforms-home-form-actions__rename-input"
						value={formTitle}
						onChange={(val) => {
							if (!val) {
								createErrorNotice(
									'⛔ Form title cannot be empty!',
									{
										type: 'snackbar',
										isDismissible: true,
									}
								);
								return;
							}
							setFormTitle(val);
							editEntityRecord(
								'postType',
								'quill_forms',
								formId,
								{ title: val }
							);
						}}
					/>
					<Button
						isPrimary
						className="quillforms-home-form-actions__rename-button"
						onClick={async () => {
							setIsLoading(true);
							const res = await saveEditedEntityRecord(
								'postType',
								'quill_forms',
								formId
							);
							if (!res) {
								createErrorNotice(
									'⛔ Errror in form renaming!',
									{
										type: 'snackbar',
										isDismissible: true,
									}
								);
								setIsLoading(false);
							} else {
								createSuccessNotice(
									'✅ Form renamed successfully!',
									{
										type: 'snackbar',
										isDismissible: true,
									}
								);
							}
							setShowRenameForm(false);
						}}
					>
						Rename
					</Button>

				</Modal>
			)}
			{editSlug && (
				<Modal
					title="Change Form Slug"
					onRequestClose={() => setEditSlug(false)}
				>
					<TextControl
						type="text"
						className="quillforms-home-form-actions__rename-input"
						value={formSlug}
						onChange={(val) => {
							if (!val) {
								createErrorNotice(
									'⛔ Form slug cannot be empty!',
									{
										type: 'snackbar',
										isDismissible: true,
									}
								);
								return;
							}
							setFormSlug(val);
							editEntityRecord(
								'postType',
								'quill_forms',
								formId,
								{ slug: val }
							);
						}}
					/>
					<Button
						isPrimary
						className="quillforms-home-form-actions__rename-button"
						onClick={async () => {
							setIsLoading(true);
							const res = await saveEditedEntityRecord(
								'postType',
								'quill_forms',
								formId
							);
							if (!res) {
								createErrorNotice(
									'⛔ Errror in form slug changing!',
									{
										type: 'snackbar',
										isDismissible: true,
									}
								);
								setIsLoading(false);
							} else {
								createSuccessNotice(
									'✅ Form slug changed successfully!',
									{
										type: 'snackbar',
										isDismissible: true,
									}
								);
							}
							setEditSlug(false);
						}}
					>
						Change
					</Button>
				</Modal>
			)}
		</div>
	);
};

export default FormActions;
