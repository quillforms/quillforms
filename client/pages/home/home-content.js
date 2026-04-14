import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	Button,
	Dropdown,
	MenuGroup,
	MenuItem,
	CheckboxControl,
} from '@wordpress/components';

import { size } from 'lodash';

import './style.scss';
import AddFormModal from './add-form-modal';
import ImportFormModal from './import-form-modal';
import { FormCard, EmptyState } from './form-card';
import { FormsSkeleton, FormCardSkeleton } from './form-skeleton';
import { gridIcon, listIcon } from './icons';
import CustomButton from '../../components/custom-button';
import CustomSearch from '../../components/custom-search';
import CustomTabs from '../../components/custom-tabs';
import ArrowButtonIcon from './icons/arrow-button';
import ImportIcon from './icons/import-icon';
import CustomModal from '../../components/custom-modal';
import TrashIcon from './icons/trash-icon';
import trashImage from '../../../assets/images/trash.png';

const ListHeader = ({ selectAll, handleSelectAll }) => (
	<div className="list-header">
		<div className="header-cell checkbox-cell">
			<CheckboxControl
				checked={selectAll}
				onChange={handleSelectAll}
			/>
		</div>
		<div className="header-cell">{__('Title', 'quillforms')}</div>
		<div className="header-cell">{__('Responses Count', 'quillforms')}</div>
		<div className="header-cell">{__('Status', 'quillforms')}</div>
		<div className="header-cell"> {__('Actions', 'quillforms')}</div>
	</div>
);

const HomeContent = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isImportModalOpen, setIsImportModalOpen] = useState(false);
	const [isFetchingOnMount, setIsFetchingOnMount] = useState(true);
	const [viewMode, setViewMode] = useState('list');
	const [searchTerm, setSearchTerm] = useState('');
	const [currentStatus, setCurrentStatus] = useState('all');
	const [sortBy, setSortBy] = useState('date');
	const [selectedForms, setSelectedForms] = useState([]);
	const [selectAll, setSelectAll] = useState(false);
	const [showBulkTrashModal, setShowBulkTrashModal] = useState(false);
	const [isBulkDeleting, setIsBulkDeleting] = useState(false);

	const handleSelectAll = (checked) => {
		setSelectAll(checked);
		if (checked && forms && Array.isArray(forms)) {
			setSelectedForms(forms.map((form) => form.id));
		} else {
			setSelectedForms([]);
		}
	};

	const handleSelectForm = (formId, checked) => {
		setSelectedForms((prev) =>
			checked ? [...prev, formId] : prev.filter((id) => id !== formId)
		);
		setSelectAll(false);
	};

	const BulkActions = () => {
		if (selectedForms.length === 0) return null;

		if (currentStatus === 'trash') {
			return (
				<div className="bulk-actions">
					<Button isSecondary onClick={() => handleBulkRestore()}>
						{__('Restore Selected', 'quillforms')} ({selectedForms.length})
					</Button>
					<Button isDanger onClick={() => handleBulkDelete(true)}>
						{__('Delete Permanently', 'quillforms')} ({selectedForms.length})
					</Button>
				</div>
			);
		}

		return (
			<div className="bulk-actions">
				<Dropdown
					className="bulk-actions-dropdown"
					position="bottom left"
					renderToggle={({ isOpen, onToggle }) => (
						<Button onClick={onToggle} aria-expanded={isOpen}>
							{__('Bulk Actions', 'quillforms')} ({selectedForms.length})
						</Button>
					)}
					renderContent={() => (
						<MenuGroup>
							<MenuItem onClick={() => handleBulkStatusChange('publish')}>
								{__('Publish Selected', 'quillforms')}
							</MenuItem>
							<MenuItem onClick={() => handleBulkStatusChange('draft')}>
								{__('Move to Draft', 'quillforms')}
							</MenuItem>
							<MenuItem onClick={() => handleBulkDelete(false)} isDestructive>
								{__('Move to Trash', 'quillforms')}
							</MenuItem>
						</MenuGroup>
					)}
				/>
			</div>
		);
	};

	const { updateEntityRecord, deleteEntityRecord } = useDispatch('core');
	const { createSuccessNotice, createErrorNotice } = useDispatch('core/notices');

	const handleBulkStatusChange = async (newStatus) => {
		const updatePromises = selectedForms.map((formId) =>
			updateEntityRecord('postType', 'quill_forms', formId, { status: newStatus })
		);

		try {
			await Promise.all(updatePromises);
			createSuccessNotice(
				__(
					`${selectedForms.length} forms ${newStatus === 'publish' ? 'published' : 'moved to draft'
					}!`,
					'quillforms'
				),
				{ type: 'snackbar' }
			);
			setSelectedForms([]);
			setSelectAll(false);
		} catch (error) {
			createErrorNotice(__('Error updating forms!', 'quillforms'), { type: 'snackbar' });
		}
	};

	const handleBulkDelete = async (permanent = false) => {
		setIsBulkDeleting(true);
		const deletePromises = selectedForms.map((formId) =>
			deleteEntityRecord(
				'postType',
				'quill_forms',
				formId,
				permanent ? { force: true } : {}
			)
		);

		try {
			await Promise.all(deletePromises);
			createSuccessNotice(
				__(
					`${selectedForms.length} forms ${permanent ? 'permanently deleted' : 'moved to trash'
					}!`,
					'quillforms'
				),
				{ type: 'snackbar' }
			);
			setSelectedForms([]);
			setSelectAll(false);
		} catch (error) {
			createErrorNotice(__('Error deleting forms!', 'quillforms'), { type: 'snackbar' });
		}
		setIsBulkDeleting(false);
		setShowBulkTrashModal(false);
	};

	const handleBulkRestore = async () => {
		const restorePromises = selectedForms.map((formId) =>
			updateEntityRecord('postType', 'quill_forms', formId, { status: 'draft' })
		);

		try {
			await Promise.all(restorePromises);
			createSuccessNotice(
				`${selectedForms.length} ${__('forms restored!', 'quillforms')}`,
				{ type: 'snackbar' }
			);
			setSelectedForms([]);
			setSelectAll(false);
		} catch (error) {
			createErrorNotice(__('Error restoring forms!', 'quillforms'), { type: 'snackbar' });
		}
	};

	const handleExport = () => {
		if (!forms || forms.length === 0) {
			return;
		}

		const formsToExport =
			selectedForms.length > 0
				? forms.filter((form) => selectedForms.includes(form.id))
				: forms;

		if (formsToExport.length === 0) {
			return;
		}

		const rows = formsToExport.map((form) => ({
			ID: form.id,
			Title: form.title?.rendered || __('Untitled Form', 'quillforms'),
			Status: form.status,
			Responses: form.responses_count ?? 0,
			Modified: form.modified,
		}));

		const headers = Object.keys(rows[0]);
		const escapeCell = (value) =>
			`"${String(value ?? '')
				.replace(/"/g, '""')
				.replace(/\r?\n/g, ' ')}"`;
		const csvContent = [
			headers.join(','),
			...rows.map((row) => headers.map((key) => escapeCell(row[key])).join(',')),
		].join('\n');

		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download =
			selectedForms.length > 0
				? 'quillforms-selected-forms.csv'
				: 'quillforms-all-forms.csv';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	const { invalidateResolution } = useDispatch('core/data');

	useEffect(() => {
		return () => {
			invalidateResolution('core', 'getEntityRecords', recordArgs);
		};
	}, []);

	const recordArgs = [
		'postType',
		'quill_forms',
		{
			status: currentStatus === 'all' ? 'publish,draft' : currentStatus,
			per_page: -1,
			search: searchTerm,
			orderby: sortBy,
			order: sortBy === 'title' ? 'asc' : 'desc',
		},
	];

	const { forms, hasFormsFinishedResolution } = useSelect(
		(select) => ({
			forms: select('core').getEntityRecords(...recordArgs),
			hasFormsFinishedResolution: select('core').hasFinishedResolution(
				'getEntityRecords',
				recordArgs
			),
		}),
		[currentStatus, searchTerm, sortBy]
	);

	const stats = useSelect((select) => {
		const allForms = select('core').getEntityRecords('postType', 'quill_forms', {
			per_page: -1,
			status: 'publish,draft,trash',
		});

		if (!allForms)
			return {
				all: 0,
				published: 0,
				draft: 0,
				trash: 0,
			};

		return {
			all: allForms.filter((form) => form.status !== 'trash').length,
			published: allForms.filter((form) => form.status === 'publish').length,
			draft: allForms.filter((form) => form.status === 'draft').length,
			trash: allForms.filter((form) => form.status === 'trash').length,
		};
	}, []);

	const tabs = [
		{
			name: 'all',
			title: `${__('All', 'quillforms')} (${stats.all})`,
			className: 'tab-all',
		},
		{
			name: 'publish',
			title: `${__('Published', 'quillforms')} (${stats.published})`,
			className: 'tab-published',
		},
		{
			name: 'draft',
			title: `${__('Drafts', 'quillforms')} (${stats.draft})`,
			className: 'tab-drafts',
		},
		{
			name: 'trash',
			title: `${__('Trash', 'quillforms')} (${stats.trash})`,
			className: 'tab-trash',
		},
	];

	return (
		<div className="quillforms-home">
			<div className="quillforms-home__header">
				<div className="quillforms-home__header-left">
					<h1 className="!text-2xl !font-bold !text-[#001D4F]">{__('Forms', 'quillforms')}</h1>
				</div>
				<div className="quillforms-home__header-right">
					<div className="view-mode-toggle">
						<Button
							isPressed={viewMode === 'grid'}
							onClick={() => setViewMode('grid')}
							icon={
								<span
									style={{ color: viewMode === 'grid' ? '#B2328C' : '#334155' }}
									className="view-icon"
								>
									{gridIcon}
								</span>
							}
						/>
						<Button
							isPressed={viewMode === 'list'}
							onClick={() => setViewMode('list')}
							icon={
								<span
									style={{ color: viewMode === 'list' ? '#B2328C' : '#334155' }}
									className="view-icon"
								>
									{listIcon}
								</span>
							}
						/>
					</div>

					{selectedForms.length > 0 ? (
						<div className="flex items-center gap-3">
							<button
								type="button"
								className="flex items-center gap-1 text-lg font-medium leading-7 text-[#E13B3B] focus:outline-none bg-transparent border-none"
								onClick={() => {
									setShowBulkTrashModal(true);
								}}
							>
								{__('Delete all', 'quillforms')}
								<span className="inline-flex items-center">
									<TrashIcon width={18} height={18} />
								</span>
							</button>

							<span className="forms-header-divider" />

							<CustomButton
								variant="outlineSecondary"
								text={__('Export all', 'quillforms')}
								icon={
									<svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M10 3V13M10 13L6 9M10 13L14 9M3 17H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								}
								onClick={handleExport}
							/>
						</div>
					) : (
						<div className="flex items-center gap-3">
							<CustomButton
								variant="outlineSecondary"
								text={__('Import', 'quillforms')}
								onClick={() => setIsImportModalOpen(true)}
								icon={<ImportIcon />}
							/>
							<CustomButton
								text={__('Add new form', 'quillforms')}
								onClick={() => setIsModalOpen(true)}
							/>
						</div>
					)}
				</div>
			</div>
			<div className="quillforms-home__header">
				<div className="quillforms-home__header-left">
					<CustomSearch
						value={searchTerm}
						onChange={setSearchTerm}
						placeholder={__('Search forms...', 'quillforms')}
					/>
				</div>
				<div className="quillforms-home__header-right">
					<div className="flex items-center !gap-1.5 select-all-wrapper">
						<CheckboxControl
							checked={selectAll}
							onChange={handleSelectAll}
						/>
						<p className="m-0 text-base font-semibold leading-7 text-[#B2328C]">
							{__('Select all', 'quillforms')}
						</p>
					</div>
					<Dropdown
						className="sort-dropdown"
						position="bottom left"
						renderToggle={({ isOpen, onToggle }) => (
							<div className="flex items-center gap-3">
								<p className="text-lg font-semibold leading-7 text-[#334155]">
									{__('Sort by:', 'quillforms')}
								</p>
								<CustomButton
									className='!py-1 !px-2 !capitalize'
									variant="outline"
									text={sortBy}
									onClick={onToggle}
									aria-expanded={isOpen}
									icon={<ArrowButtonIcon />}
								/>
							</div>
						)}
						renderContent={() => (
							<MenuGroup
							>
								<MenuItem onClick={() => setSortBy('date')}>
									{__('Date', 'quillforms')}
								</MenuItem>
								<MenuItem onClick={() => setSortBy('title')}>
									{__('Title', 'quillforms')}
								</MenuItem>
							</MenuGroup>
						)}
					/>
				</div>

			</div>

			<CustomTabs
				className="quillforms-home__tabs"
				tabs={tabs}
				onSelect={setCurrentStatus}
				initialTabName={currentStatus}
			>
				{(tab) => (
					<div className={`quillforms-home__forms-grid view-${viewMode}`}>

						{viewMode === 'list' && forms && size(forms) > 0 && (
							<ListHeader
								selectAll={selectAll}
								handleSelectAll={handleSelectAll}
							/>
						)}
						{!hasFormsFinishedResolution && isFetchingOnMount ? (
							<FormsSkeleton viewMode={viewMode} />
						) : !forms || size(forms) === 0 ? (
							<EmptyState
								status={currentStatus}
								onCreateNew={() => setIsModalOpen(true)}
							/>
						) : (
							forms.map((form) => (
								<FormCard
									key={form.id}
									form={form}
									viewMode={viewMode}
									isTrash={currentStatus === 'trash'}
									isSelected={selectedForms.includes(form.id)}
									onSelect={handleSelectForm}
								/>
							))
						)}
					</div>
				)}
			</CustomTabs>

			{isModalOpen && <AddFormModal closeModal={() => setIsModalOpen(false)} />}
			<ImportFormModal
				isOpen={isImportModalOpen}
				onClose={() => setIsImportModalOpen(false)}
			/>

			{/* Bulk Trash Modal */}
			<CustomModal
				isOpen={showBulkTrashModal}
				onClose={() => setShowBulkTrashModal(false)}
				title={__('Move to Trash', 'quillforms')}
				noBorder={true}
				centerTitle={true}
			>
				<div className="flex flex-col items-center gap-6 py-4">
					<img
						src={trashImage}
						alt="Trash"
						className="w-32 h-32 object-contain"
					/>
					<p className="text-base text-[#64748B] text-center">
						{selectedForms.length > 0
							? `${__('Do you want to delete', 'quillforms')} ${selectedForms.length} ${__('selected forms?', 'quillforms')}`
							: __('Do you want to delete all forms?', 'quillforms')
						}
					</p>
					<div className="flex gap-3 w-full justify-end">
						<CustomButton
							variant="outlineSecondary"
							text={__('Cancel', 'quillforms')}
							onClick={() => setShowBulkTrashModal(false)}
						/>
						<CustomButton
							variant="danger"
							text={__('Delete', 'quillforms')}
							onClick={() => handleBulkDelete(false)}
						/>
					</div>
				</div>
			</CustomModal>
		</div>
	);
};

export default HomeContent;
