import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import {
	Card,
	Dropdown,
	MenuGroup,
	MenuItem,
	CheckboxControl,
	Modal,
	TextControl
} from '@wordpress/components';

import { Button } from "@quillforms/admin-components";
import { FormCardSkeleton } from './form-skeleton';
import { getHistory, getNewPath, NavLink } from '@quillforms/navigation';
import { trashEmptyIcon, formsEmptyIcon, moreVertical } from './icons';
import classnames from 'classnames';
import { Icon } from '@wordpress/icons';
import { css } from "emotion";

const MoreVerticalIcon = () => (
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

export const FormCard = ({ form, viewMode, isTrash, isSelected, onSelect }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [showRenameForm, setShowRenameForm] = useState(false);
	const [formTitle, setFormTitle] = useState(form.title.raw);
	const [editSlug, setEditSlug] = useState(false);
	const [formSlug, setFormSlug] = useState(form.slug);

	const { createSuccessNotice, createErrorNotice } = useDispatch('core/notices');
	const { deleteEntityRecord, editEntityRecord, saveEditedEntityRecord } = useDispatch('core');
	const { invalidateResolution } = useDispatch('core/data');

	const theme = form?.theme?.theme_data?.properties ?? {};
	const lastModified = new Date(form.modified).toLocaleDateString();
	const responsesCount = form?.responses_count ?? 0;

	const duplicate = async () => {
		const data = new FormData();
		data.append('action', 'quillforms_duplicate_form');
		data.append('form_id', form.id);
		data.append('_nonce', window.qfAdmin.duplicate_nonce);

		try {
			const response = await fetch(`${window.qfAdmin.adminUrl}admin-ajax.php`, {
				method: 'POST',
				credentials: 'same-origin',
				body: data,
			});
			const res = await response.json();

			if (res.success) {
				invalidateResolution('core', 'getEntityRecords', [
					'postType',
					'quill_forms',
					{
						status: 'publish,draft',
						per_page: -1,
					},
				]);
				createSuccessNotice('✅ Form duplicated successfully!', {
					type: 'snackbar',
					isDismissible: true,
				});
			} else {
				createErrorNotice(`⛔ Can't duplicate form`, {
					type: 'snackbar',
					isDismissible: true,
				});
			}
		} catch (err) {
			createErrorNotice(`⛔ ${err ?? 'Error'}`, {
				type: 'snackbar',
				isDismissible: true,
			});
		}
	};

	const handleDelete = async (permanent = false) => {
		if (!confirm(`Are you sure you want to ${permanent ? 'permanently delete' : 'move to trash'} this form?`)) {
			return;
		}

		setIsLoading(true);
		try {
			const res = await deleteEntityRecord('postType', 'quill_forms', form.id, permanent ? { force: true } : {});
			if (!res) {
				createErrorNotice('⛔ Error in form deletion!', {
					type: 'snackbar',
					isDismissible: true,
				});
			} else {
				createSuccessNotice(`✅ Form ${permanent ? 'permanently deleted' : 'moved to trash'} successfully!`, {
					type: 'snackbar',
					isDismissible: true,
				});
			}
		} catch (error) {
			createErrorNotice('Error deleting form!', { type: 'snackbar' });
		}
		setIsLoading(false);
	};

	const handleRestore = async () => {
		setIsLoading(true);
		try {
			editEntityRecord('postType', 'quill_forms', form.id, { status: 'draft' });
			const res = await saveEditedEntityRecord('postType', 'quill_forms', form.id);
			if (!res) {
				createErrorNotice('⛔ Error restoring form!', {
					type: 'snackbar',
					isDismissible: true,
				});
			} else {
				createSuccessNotice('✅ Form restored successfully!', {
					type: 'snackbar',
					isDismissible: true,
				});
			}
		} catch (error) {
			createErrorNotice('Error restoring form!', { type: 'snackbar' });
		}
		setIsLoading(false);
	};

	if (isLoading) {
		return <FormCardSkeleton viewMode={viewMode} />;
	}

	const renderActions = () => (
		isTrash ? (
			<Dropdown
				className="form-card__dropdown"
				position="bottom left"
				renderToggle={({ isOpen, onToggle }) => (
					<Button
						className="form-card__dropdown-toggle"
						onClick={onToggle}
						aria-expanded={isOpen}
					>
						<MoreVerticalIcon />
					</Button>
				)}
				renderContent={({ onClose }) => (
					<MenuGroup>
						<MenuItem onClick={() => {
							handleRestore();
							onClose();
						}}>
							Restore
						</MenuItem>
						<MenuItem
							onClick={() => {
								handleDelete(true);
								onClose();
							}}
							isDestructive
						>
							Delete Permanently
						</MenuItem>
					</MenuGroup>
				)}
			/>
		) : (
			<Dropdown
				className="form-card__dropdown"
				position="bottom left"
				renderToggle={({ isOpen, onToggle }) => (
					<Button
						className="form-card__dropdown-toggle"
						onClick={onToggle}
						aria-expanded={isOpen}
					>
						<MoreVerticalIcon />
					</Button>
				)}
				renderContent={({ onClose }) => (
					<>
						<MenuGroup>
							<MenuItem
								onClick={() => {
									getHistory().push(
										getNewPath({}, `/forms/${form.id}/builder`)
									);
									onClose();
								}}
							>
								Edit
							</MenuItem>
							<MenuItem
								onClick={() => {
									getHistory().push(
										getNewPath({}, `/forms/${form.id}/results`)
									);
									onClose();
								}}
							>
								Results
							</MenuItem>
							<MenuItem
								onClick={() => {
									getHistory().push(
										getNewPath({}, `/forms/${form.id}/integrations`)
									);
									onClose();
								}}
							>
								Integrations
							</MenuItem>
							<MenuItem
								onClick={() => {
									getHistory().push(
										getNewPath({}, `/forms/${form.id}/share`)
									);
									onClose();
								}}
							>
								Share
							</MenuItem>
						</MenuGroup>

						<MenuGroup>
							<MenuItem
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
								onClick={() => {
									setShowRenameForm(true);
									onClose();
								}}
							>
								Rename
							</MenuItem>
							<MenuItem
								onClick={() => {
									setEditSlug(true);
									onClose();
								}}
							>
								Change slug
							</MenuItem>
							<MenuItem
								onClick={async () => {
									setIsLoading(true);
									const newStatus = form.status === 'publish' ? 'draft' : 'publish';
									editEntityRecord('postType', 'quill_forms', form.id, { status: newStatus });
									const res = await saveEditedEntityRecord('postType', 'quill_forms', form.id);
									if (!res) {
										createErrorNotice('⛔ Error!', {
											type: 'snackbar',
											isDismissible: true,
										});
									} else {
										createSuccessNotice(
											`✅ Form status changed to ${newStatus} successfully!`,
											{
												type: 'snackbar',
												isDismissible: true,
											}
										);
									}
									setIsLoading(false);
									onClose();
								}}
							>
								{form.status === 'publish' ? 'Move to draft' : 'Publish'}
							</MenuItem>
						</MenuGroup>

						<MenuGroup>
							<MenuItem
								isDestructive
								onClick={() => {
									handleDelete(false);
									onClose();
								}}
							>
								Move to Trash
							</MenuItem>
						</MenuGroup>
					</>
				)}
			/>
		)
	);

	if (viewMode === 'list') {
		return (
			<>
				<div className="form-card form-card--list">
					<div className="title-column">
						<div
							className="form-card__preview"
							style={{
								backgroundColor: theme.backgroundColor,
								backgroundImage: theme.backgroundImage ? `url(${theme.backgroundImage})` : 'none'
							}}
						/>
						<div className="form-card__title-wrapper">
							<div className={classnames("form-card__title", css`
									color: ${theme.fontColor};
									cursor: pointer;
								`)}
								onClick={() => {
									getHistory().push(
										getNewPath({}, `/forms/${form.id}/builder`)
									);
								}
								}
							>
								{form.title.rendered || 'Untitled Form'}
							</div>
							<span className={`status-indicator status-${form.status}`}>
								{form.status === 'publish' ? 'Published' : form.status}
							</span>
						</div>
					</div>
					<div className="responses-count-column">
						{form.responses_count} responses
					</div>
					<div className="date-column">
						{lastModified}
					</div>
					<div className="actions-column">
						{renderActions()}
					</div>
				</div>

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
									createErrorNotice('⛔ Form title cannot be empty!', {
										type: 'snackbar',
										isDismissible: true,
									});
									return;
								}
								setFormTitle(val);
								editEntityRecord('postType', 'quill_forms', form.id, { title: val });
							}}
						/>
						<Button
							isPrimary
							className="quillforms-home-form-actions__rename-button"
							onClick={async () => {
								setIsLoading(true);
								const res = await saveEditedEntityRecord('postType', 'quill_forms', form.id);
								if (!res) {
									createErrorNotice('⛔ Error in form renaming!', {
										type: 'snackbar',
										isDismissible: true,
									});
								} else {
									createSuccessNotice('✅ Form renamed successfully!', {
										type: 'snackbar',
										isDismissible: true,
									});
								}
								setIsLoading(false);
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
									createErrorNotice('⛔ Form slug cannot be empty!', {
										type: 'snackbar',
										isDismissible: true,
									});
									return;
								}
								setFormSlug(val);
								editEntityRecord('postType', 'quill_forms', form.id, { slug: val });
							}}
						/>
						<Button
							isPrimary
							className="quillforms-home-form-actions__rename-button"
							onClick={async () => {
								setIsLoading(true);
								const res = await saveEditedEntityRecord('postType', 'quill_forms', form.id);
								if (!res) {
									createErrorNotice('⛔ Error in form slug changing!', {
										type: 'snackbar',
										isDismissible: true,
									});
								} else {
									createSuccessNotice('✅ Form slug changed successfully!', {
										type: 'snackbar',
										isDismissible: true,
									});
								}
								setIsLoading(false);
								setEditSlug(false);
							}}
						>
							Change
						</Button>
					</Modal>
				)}
			</>
		);
	}

	return (
		<>
			<Card
				className={classnames(
					'form-card',
					`form-card--${viewMode}`,
					`form-card--${form.status}`
				)}
			>
				<div
					className="form-card__preview"
					style={{
						backgroundColor: theme.backgroundColor,
						backgroundImage: theme.backgroundImage ? `url(${theme.backgroundImage})` : 'none',
						cursor: 'pointer'
					}}
					onClick={
						() => {
							getHistory().push(
								getNewPath({}, `/forms/${form.id}/builder`)
							);
						}
					}
				>
					<div className={classnames("form-card__title", css`
								color: ${theme.fontColor};
							`)}


					>
						{form.title.rendered || 'Untitled Form'}
					</div>
				</div>

				<div className="form-card__footer">
					<div className="form-card__meta">
						<span className={`status-indicator status-${form.status}`}>
							{form.status === 'publish' ? 'Published' : form.status}
						</span>
						<span>{responsesCount} responses</span>
						<div className="form-card__actions">
							{renderActions()}
						</div>
					</div>

				</div>
			</Card>

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
								createErrorNotice('⛔ Form title cannot be empty!', {
									type: 'snackbar',
									isDismissible: true,
								});
								return;
							}
							setFormTitle(val);
							editEntityRecord('postType', 'quill_forms', form.id, { title: val });
						}}
					/>
					<Button
						isPrimary
						className="quillforms-home-form-actions__rename-button"
						onClick={async () => {
							setIsLoading(true);
							const res = await saveEditedEntityRecord('postType', 'quill_forms', form.id);
							if (!res) {
								createErrorNotice('⛔ Error in form renaming!', {
									type: 'snackbar',
									isDismissible: true,
								});
							} else {
								createSuccessNotice('✅ Form renamed successfully!', {
									type: 'snackbar',
									isDismissible: true,
								});
							}
							setIsLoading(false);
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
								createErrorNotice('⛔ Form slug cannot be empty!', {
									type: 'snackbar',
									isDismissible: true,
								});
								return;
							}
							setFormSlug(val);
							editEntityRecord('postType', 'quill_forms', form.id, { slug: val });
						}}
					/>
					<Button
						isPrimary
						className="quillforms-home-form-actions__rename-button"
						onClick={async () => {
							setIsLoading(true);
							const res = await saveEditedEntityRecord('postType', 'quill_forms', form.id);
							if (!res) {
								createErrorNotice('⛔ Error in form slug changing!', {
									type: 'snackbar',
									isDismissible: true,
								});
							} else {
								createSuccessNotice('✅ Form slug changed successfully!', {
									type: 'snackbar',
									isDismissible: true,
								});
							}
							setIsLoading(false);
							setEditSlug(false);
						}}
					>
						Change
					</Button>
				</Modal>
			)}
		</>
	);
};

// EmptyState component remains the same
export const EmptyState = ({ status, onCreateNew }) => {
	const messages = {
		all: {
			title: 'Create your first form',
			description: 'Get started by creating a new form from scratch or using a template.',
			action: 'Create Form'
		},
		trash: {
			title: 'Trash is empty',
			description: 'No forms in trash.',
			action: null
		},
		draft: {
			title: 'No draft forms',
			description: 'Draft forms will appear here.',
			action: 'Create Form'
		},
		publish: {
			title: 'No published forms',
			description: 'Published forms will appear here.',
			action: 'Create Form'
		}
	};

	const currentMessage = messages[status];

	return (
		<div className="forms-empty-state">
			<Icon icon={status === 'trash' ? trashEmptyIcon : formsEmptyIcon} />
			<h2>{currentMessage.title}</h2>
			<p>{currentMessage.description}</p>
			{currentMessage.action && (
				<Button
					isPrimary
					onClick={onCreateNew}
				>
					{currentMessage.action}
				</Button>
			)}
		</div>
	);
};