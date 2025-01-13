import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	TabPanel,
	SearchControl,
	Button,
	Dropdown,
	MenuGroup,
	MenuItem,
	CheckboxControl,
} from '@wordpress/components';
import {
	listIcon as list,
	gridIcon as grid,
} from './icons';
import { size } from 'lodash';

import './style.scss';
import AddFormModal from './add-form-modal';
import { FormCard, EmptyState } from './form-card';
import { FormsSkeleton, FormCardSkeleton } from './form-skeleton';

const ListHeader = () => (
	<div className="list-header">
		<div className="header-cell">{__('Title', 'quillforms')}</div>
		<div className="header-cell">{__('Responses Count', 'quillforms')}</div>
		<div className="header-cell">{__('Last Modified', 'quillforms')}</div>
		<div className="header-cell"></div>
	</div>
);

const HomeContent = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
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
					<h1>{__('Forms', 'quillforms')}</h1>
					{selectedForms.length > 0 ? (
						<BulkActions />
					) : (
						<Button
							isPrimary
							className="add-new-form-button"
							onClick={() => setIsModalOpen(true)}
						>
							<plus-icon /> {__('New Form', 'quillforms')}
						</Button>
					)}
				</div>
				<div className="quillforms-home__header-right">
					<SearchControl
						value={searchTerm}
						onChange={setSearchTerm}
						placeholder={__('Search forms...', 'quillforms')}
					/>
					<Dropdown
						className="sort-dropdown"
						position="bottom left"
						renderToggle={({ isOpen, onToggle }) => (
							<Button onClick={onToggle} aria-expanded={isOpen}>
								{__('Sort by:', 'quillforms')} {sortBy}
							</Button>
						)}
						renderContent={() => (
							<MenuGroup>
								<MenuItem onClick={() => setSortBy('date')}>
									{__('Date', 'quillforms')}
								</MenuItem>
								<MenuItem onClick={() => setSortBy('title')}>
									{__('Title', 'quillforms')}
								</MenuItem>
							</MenuGroup>
						)}
					/>
					<div className="view-mode-toggle">
						<Button
							isPressed={viewMode === 'grid'}
							onClick={() => setViewMode('grid')}
							icon={grid}
						/>
						<Button
							isPressed={viewMode === 'list'}
							onClick={() => setViewMode('list')}
							icon={list}
						/>
					</div>
				</div>
			</div>

			<TabPanel
				className="quillforms-home__tabs"
				tabs={tabs}
				onSelect={setCurrentStatus}
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
			</TabPanel>

			{isModalOpen && <AddFormModal closeModal={() => setIsModalOpen(false)} />}
		</div>
	);
};

export default HomeContent;