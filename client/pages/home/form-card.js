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
import { __ } from '@wordpress/i18n';
import CustomButton from '../../components/custom-button';
import ClockIcon from './icons/colck-icon';
import EditIcon from './icons/edit-icon';
import ResultsIcon from './icons/result-icon';
import IntegrationIcon from './icons/intergation-icon';
import ShareIcon from './icons/share-icon';
import DuplicateIcon from './icons/dublicate-icon';
import RenameIcon from './icons/rename-icon';
import SlugIcon from './icons/slug-icon';
import UserIcon from './icons/user-icon';
import MoreHorizinatialIcon from './icons/more-horizinatial';
// import emptyState from '../../../assets/addons/emptystate/emptyState.png';

// Use horizontal more icon (three dots in a row)
const MoreVerticalIcon = () => <MoreHorizinatialIcon width={24} height={24} />;

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
						<MoreHorizinatialIcon />
					</Button>
				)}
				renderContent={({ onClose }) => (
					<MenuGroup>
						<MenuItem onClick={() => {
							handleRestore();
							onClose();
						}}>
							{__('Restore', 'quillforms')}
						</MenuItem>
						<MenuItem
							onClick={() => {
								handleDelete(true);
								onClose();
							}}
							isDestructive
						>
							{__('Delete Permanently', 'quillforms')}
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
							<p className='text-base !text-[#777] leading-[26px] mb-2'>{__('Content Management', 'quillforms')}</p>
							<MenuItem
								className='flex !p-0 items-center !gap-2 text-lg font-medium !text-[#334155] leading-7'
								onClick={() => {
									getHistory().push(
										getNewPath({}, `/forms/${form.id}/builder`)
									);
									onClose();
								}}
							>
								<EditIcon />
								{__('Edit', 'quillforms')}
							</MenuItem>
							<MenuItem
								className='flex !p-0 items-center !gap-2 text-lg font-medium !text-[#334155] leading-7'
								onClick={() => {
									getHistory().push(
										getNewPath({}, `/forms/${form.id}/results`)
									);
									onClose();
								}}
							>
								<ResultsIcon />
								{__('Results', 'quillforms')}
							</MenuItem>
							<MenuItem
								className='flex !p-0 items-center !gap-2 text-lg font-medium !text-[#334155] leading-7'
								onClick={() => {
									getHistory().push(
										getNewPath({}, `/forms/${form.id}/integrations`)
									);
									onClose();
								}}
							>
								<IntegrationIcon />
								{__('Integrations', 'quillforms')}
							</MenuItem>
							<MenuItem
								className='flex !p-0 items-center !gap-2 text-lg font-medium !text-[#334155] leading-7'
								onClick={() => {
									getHistory().push(
										getNewPath({}, `/forms/${form.id}/share`)
									);
									onClose();
								}}
							>
								<ShareIcon />
								{__('Share', 'quillforms')}
							</MenuItem>
						</MenuGroup>

						<MenuGroup>
							<p className='text-base !text-[#777] leading-[26px] mb-2'>{__('Structure & Properties', 'quillforms')}</p>
							<MenuItem
								className='flex !p-0 items-center !gap-2 text-lg font-medium !text-[#334155] leading-7'
								onClick={async () => {
									setIsLoading(true);
									await duplicate();
									setIsLoading(false);
									onClose();
								}}
							>
								<DuplicateIcon />
								{__('Duplicate', 'quillforms')}
							</MenuItem>
							<MenuItem
								className='flex !p-0 items-center !gap-2 text-lg font-medium !text-[#334155] leading-7'
								onClick={() => {
									setShowRenameForm(true);
									onClose();
								}}
							>
								<RenameIcon />
								{__('Rename', 'quillforms')}
							</MenuItem>
							<MenuItem
								className='flex !p-0 items-center !gap-2 text-lg font-medium !text-[#334155] leading-7'
								onClick={() => {
									setEditSlug(true);
									onClose();
								}}
							>
								<SlugIcon />
								{__('Change slug', 'quillforms')}
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
								{form.status === 'publish' ? __('Move to draft', 'quillforms') : __('Publish', 'quillforms')}
							</MenuItem>
						</MenuGroup>

						<MenuGroup>
							<p className='text-base !text-[#777] leading-[26px] mb-2'>{__('Change Status', 'quillforms')}</p>
							<MenuItem
								isDestructive
								onClick={() => {
									handleDelete(false);
									onClose();
								}}
							>
								{__('Move to Trash', 'quillforms')}
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
					<div className="checkbox-column">
						<CheckboxControl
							checked={isSelected}
							onChange={() => onSelect(form.id)}
						/>
					</div>
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
								{form.title.rendered || __('Untitled Form', 'quillforms')}
							</div>
							<span className="form-card__date"><ClockIcon />{lastModified}</span>
						</div>
					</div>
					<div className="responses-count-column">
						{form.responses_count || 0}
					</div>
					<div className="status-column">
						<span className={`status-indicator status-${form.status}`}>
							{form.status === 'publish' ? __('Published', 'quillforms') : form.status === 'draft' ? __('Draft', 'quillforms') : form.status}
						</span>
					</div>
					<div className="actions-column">
						{renderActions()}
					</div>
				</div>

				{showRenameForm && (
					<Modal
						title={__('Rename Form', 'quillforms')}
						onRequestClose={() => setShowRenameForm(false)}
					>
						<TextControl
							type="text"
							className="quillforms-home-form-actions__rename-input"
							value={formTitle}
							onChange={(val) => {
								if (!val) {
									createErrorNotice(__('⛔ Form title cannot be empty!', 'quillforms'), {
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
									createErrorNotice(__('⛔ Error in form renaming!', 'quillforms'), {
										type: 'snackbar',
										isDismissible: true,
									});
								} else {
									createSuccessNotice(__('✅ Form renamed successfully!', 'quillforms'), {
										type: 'snackbar',
										isDismissible: true,
									});
								}
								setIsLoading(false);
								setShowRenameForm(false);
							}}
						>
							{__('Rename', 'quillforms')}
						</Button>
					</Modal>
				)}

				{editSlug && (
					<Modal
						title={__('Change Form Slug', 'quillforms')}
						onRequestClose={() => setEditSlug(false)}
					>
						<TextControl
							type="text"
							className="quillforms-home-form-actions__rename-input"
							value={formSlug}
							onChange={(val) => {
								if (!val) {
									createErrorNotice(__('⛔ Form slug cannot be empty!', 'quillforms'), {
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
									createErrorNotice(__('⛔ Error in form slug changing!', 'quillforms'), {
										type: 'snackbar',
										isDismissible: true,
									});
								} else {
									createSuccessNotice(__('✅ Form slug changed successfully!', 'quillforms'), {
										type: 'snackbar',
										isDismissible: true,
									});
								}
								setIsLoading(false);
								setEditSlug(false);
							}}
						>
							{__('Change', 'quillforms')}
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
						backgroundImage: theme.backgroundImage ? `url(${theme.backgroundImage})` : 'none'
					}}
				>
					<div
						className="form-card__content"
						onClick={() => {
							getHistory().push(
								getNewPath({}, `/forms/${form.id}/builder`)
							);
						}}
					>
						<div className="form-card__header-row">
							<div className="form-card__title-wrapper">
								<svg
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="form-card__checkbox-icon"
								>
									<rect x="2" y="2" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
								</svg>
								<div className={classnames("form-card__title", css`
											color: ${theme.fontColor};
										`)}
								>
									{form.title.rendered || __('Untitled Form', 'quillforms')}
								</div>
							</div>

							<div
								className="form-card__header-actions"
								onClick={(e) => {
									e.stopPropagation();
								}}
							>
								{renderActions()}
							</div>
						</div>

						<div className="form-card__date">
							<ClockIcon width={24} height={24} />
							{lastModified}
						</div>

						<div className="form-card__meta form-card__meta--grid">
							<div className="form-card__responses-pill">
								<UserIcon />
								<span>Responses: {responsesCount}</span>
							</div>
							<span className={`form-card__status-pill status-${form.status}`}>
								<span className="form-card__status-dot" />
								{form.status === 'publish'
									? __('Completed', 'quillforms')
									: form.status === 'draft'
										? __('Draft', 'quillforms')
										: form.status}
							</span>
						</div>
					</div>
				</div>
			</Card>

			{showRenameForm && (
				<Modal
					title={__('Rename Form', 'quillforms')}
					onRequestClose={() => setShowRenameForm(false)}
				>
					<TextControl
						type="text"
						className="quillforms-home-form-actions__rename-input"
						value={formTitle}
						onChange={(val) => {
							if (!val) {
								createErrorNotice(__('⛔ Form title cannot be empty!', 'quillforms'), {
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
								createErrorNotice(__('⛔ Error in form renaming!', 'quillforms'), {
									type: 'snackbar',
									isDismissible: true,
								});
							} else {
								createSuccessNotice(__('✅ Form renamed successfully!', 'quillforms'), {
									type: 'snackbar',
									isDismissible: true,
								});
							}
							setIsLoading(false);
							setShowRenameForm(false);
						}}
					>
						{__('Rename', 'quillforms')}
					</Button>
				</Modal>
			)}

			{editSlug && (
				<Modal
					title={__('Change Form Slug', 'quillforms')}
					onRequestClose={() => setEditSlug(false)}
				>
					<TextControl
						type="text"
						className="quillforms-home-form-actions__rename-input"
						value={formSlug}
						onChange={(val) => {
							if (!val) {
								createErrorNotice(__('⛔ Form slug cannot be empty!', 'quillforms'), {
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
								createErrorNotice(__('⛔ Error in form slug changing!', 'quillforms'), {
									type: 'snackbar',
									isDismissible: true,
								});
							} else {
								createSuccessNotice(__('✅ Form slug changed successfully!', 'quillforms'), {
									type: 'snackbar',
									isDismissible: true,
								});
							}
							setIsLoading(false);
							setEditSlug(false);
						}}
					>
						{__('Change', 'quillforms')}
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
			title: __('Your dashboard is waiting for its first form.', 'quillforms'),
			description: __('Click “Add new form” to start from scratch or explore a ready-made template. Simple, flexible, and made for humans.', 'quillforms'),
			action: __('Add new form', 'quillforms')
		},
		trash: {
			title: __('Trash is empty', 'quillforms'),
			description: __('No forms in trash.', 'quillforms'),
			action: null
		},
		draft: {
			title: __('No draft forms', 'quillforms'),
			description: __('Draft forms will appear here.', 'quillforms'),
			action: __('Add new form', 'quillforms')
		},
		publish: {
			title: __('No published forms yet — but you’re just getting started. ', 'quillforms'),
			description: __('You don’t have any published forms yet, but once you share your work this is where they’ll proudly appear.', 'quillforms'),
			action: __('Add new form', 'quillforms')
		}
	};

	const currentMessage = messages[status];

	return (
		<div className="flex flex-col items-center justify-center gap-4 ">
			{/* <Icon icon={status === 'trash' ? trashEmptyIcon : formsEmptyIcon} /> */}
			{/* <img
				src={emptyState}
				alt="Empty state"
				className="max-w-full h-auto"
			/> */}
			<h2 className="text-2xl font-bold text-[#334155]">{currentMessage.title}</h2>
			<p className=' text-[#777] text-lg font-semibold leading-7'>{currentMessage.description}</p>
			{currentMessage.action && (
				<CustomButton
					className=' !py-3 !px-24'
					variant="primary"
					text={currentMessage.action}
					onClick={onCreateNew}
				/>
			)}
		</div>
	);
};
