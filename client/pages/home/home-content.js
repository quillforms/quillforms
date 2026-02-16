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

	const handleSelectAll = (checked) => {
		setSelectAll(checked);
		setSelectedForms(checked ? forms.map((form) => form.id) : []);
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
		if (
			!confirm(
				__(
					`Are you sure you want to ${permanent ? 'permanently delete' : 'move to trash'
					} ${selectedForms.length} forms?`,
					'quillforms'
				)
			)
		) {
			return;
		}

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
					<h1 className="text-2xl font-bold !text-[#001D4F]">{__('Forms', 'quillforms')}</h1>

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
						<BulkActions />
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
					<Dropdown
						className="sort-dropdown"
						position="bottom left"
						renderToggle={({ isOpen, onToggle }) => (
							<div className="flex items-center gap-3">
								<p className="text-lg font-semibold leading-7 text-[#334155]">
									{__('Sort by:', 'quillforms')}
								</p>


								<CustomButton
									className='!py-2 !capitalize'
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
						{viewMode === 'list' && (
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
		</div>
	);
};

export default HomeContent;
