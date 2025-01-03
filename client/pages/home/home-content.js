// HomeContent.js
import { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	TabPanel,
	SearchControl,
	Button,
	Dropdown,
	MenuGroup,
	MenuItem,
	CheckboxControl // Change from Checkbox to CheckboxControl

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
		<div className="header-cell">Title</div>
		<div className="header-cell">Responses Count</div>
		<div className="header-cell">Last Modified</div>
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
		setSelectedForms(checked ? forms.map(form => form.id) : []);
	};

	const handleSelectForm = (formId, checked) => {
		setSelectedForms(prev =>
			checked ? [...prev, formId] : prev.filter(id => id !== formId)
		);
		setSelectAll(false);
	};

	const BulkActions = () => {
		if (selectedForms.length === 0) return null;

		if (currentStatus === 'trash') {
			return (
				<div className="bulk-actions">
					<Button
						isSecondary
						onClick={() => handleBulkRestore()}
					>
						Restore Selected ({selectedForms.length})
					</Button>
					<Button
						isDanger
						onClick={() => handleBulkDelete(true)}
					>
						Delete Permanently ({selectedForms.length})
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
						<Button
							onClick={onToggle}
							aria-expanded={isOpen}
						>
							Bulk Actions ({selectedForms.length})
						</Button>
					)}
					renderContent={() => (
						<MenuGroup>
							<MenuItem onClick={() => handleBulkStatusChange('publish')}>
								Publish Selected
							</MenuItem>
							<MenuItem onClick={() => handleBulkStatusChange('draft')}>
								Move to Draft
							</MenuItem>
							<MenuItem
								onClick={() => handleBulkDelete(false)}
								isDestructive
							>
								Move to Trash
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
		const updatePromises = selectedForms.map(formId =>
			updateEntityRecord('postType', 'quill_forms', formId, { status: newStatus })
		);

		try {
			await Promise.all(updatePromises);
			createSuccessNotice(
				`${selectedForms.length} forms ${newStatus === 'publish' ? 'published' : 'moved to draft'}!`,
				{ type: 'snackbar' }
			);
			setSelectedForms([]);
			setSelectAll(false);
		} catch (error) {
			createErrorNotice('Error updating forms!', { type: 'snackbar' });
		}
	};

	const handleBulkDelete = async (permanent = false) => {
		if (!confirm(`Are you sure you want to ${permanent ? 'permanently delete' : 'move to trash'} ${selectedForms.length} forms?`)) {
			return;
		}

		const deletePromises = selectedForms.map(formId =>
			deleteEntityRecord('postType', 'quill_forms', formId, permanent ? { force: true } : {})
		);

		try {
			await Promise.all(deletePromises);
			createSuccessNotice(
				`${selectedForms.length} forms ${permanent ? 'permanently deleted' : 'moved to trash'}!`,
				{ type: 'snackbar' }
			);
			setSelectedForms([]);
			setSelectAll(false);
		} catch (error) {
			createErrorNotice('Error deleting forms!', { type: 'snackbar' });
		}
	};

	const handleBulkRestore = async () => {
		const restorePromises = selectedForms.map(formId =>
			updateEntityRecord('postType', 'quill_forms', formId, { status: 'draft' })
		);

		try {
			await Promise.all(restorePromises);
			createSuccessNotice(`${selectedForms.length} forms restored!`, { type: 'snackbar' });
			setSelectedForms([]);
			setSelectAll(false);
		} catch (error) {
			createErrorNotice('Error restoring forms!', { type: 'snackbar' });
		}
	};

	const { invalidateResolution } = useDispatch('core/data');

	// Invalidate resolution for entity record on unmount
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

	const { forms, hasFormsFinishedResolution } = useSelect((select) => ({
		forms: select('core').getEntityRecords(...recordArgs),
		hasFormsFinishedResolution: select('core').hasFinishedResolution(
			'getEntityRecords',
			recordArgs
		),
	}), [currentStatus, searchTerm, sortBy]);

	const stats = useSelect((select) => {
		const allForms = select('core').getEntityRecords('postType', 'quill_forms', {
			per_page: -1,
			status: 'publish,draft,trash'
		});

		if (!allForms) return {
			all: 0,
			published: 0,
			draft: 0,
			trash: 0
		};

		return {
			all: allForms.filter(form => form.status !== 'trash').length,
			published: allForms.filter(form => form.status === 'publish').length,
			draft: allForms.filter(form => form.status === 'draft').length,
			trash: allForms.filter(form => form.status === 'trash').length
		};
	}, []);
	const tabs = [
		{
			name: 'all',
			title: `All (${stats.all})`,
			className: 'tab-all'
		},
		{
			name: 'publish',
			title: `Published (${stats.published})`,
			className: 'tab-published'
		},
		{
			name: 'draft',
			title: `Drafts (${stats.draft})`,
			className: 'tab-drafts'
		},
		{
			name: 'trash',
			title: `Trash (${stats.trash})`,
			className: 'tab-trash'
		}
	];

	return (
		<div className="quillforms-home">

			<div className="quillforms-home__header">
				<div className="quillforms-home__header-left">
					<h1>Forms</h1>
					{selectedForms.length > 0 ? (
						<BulkActions />
					) : (
						<Button
							isPrimary
							className="add-new-form-button"
							onClick={() => setIsModalOpen(true)}
						>
							<plus-icon /> New Form
						</Button>
					)}
				</div>
				<div className="quillforms-home__header-right">
					<SearchControl
						value={searchTerm}
						onChange={setSearchTerm}
						placeholder="Search forms..."
					/>
					<Dropdown
						className="sort-dropdown"
						position="bottom left"
						renderToggle={({ isOpen, onToggle }) => (
							<Button
								onClick={onToggle}
								aria-expanded={isOpen}
							>
								Sort by: {sortBy}
							</Button>
						)}
						renderContent={() => (
							<MenuGroup>
								<MenuItem onClick={() => setSortBy('date')}>
									Date
								</MenuItem>
								<MenuItem onClick={() => setSortBy('title')}>
									Title
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