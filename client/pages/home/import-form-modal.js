/**
 * WordPress Dependencies.
 */
import { Modal, FormFileUpload } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

/**
 * QuillForms Dependencies.
 */
import { Button } from '@quillforms/admin-components';
import DragDrogIcon from './icons/drag-drog-icon';
import CustomButton from '../../components/custom-button';
import JsonIcon from './icons/json-icon';
import TrashIcon from './icons/trash-icon';
import CompleteIcon from './icons/complete-icon';

const ImportFormModal = ({ isOpen, onClose }) => {
	const [file, setFile] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const { createErrorNotice, createSuccessNotice } = useDispatch('core/notices');

	const uploadHandler = () => {
		if (!file) {
			createErrorNotice(
				__('⛔ Please select a file!', 'quillforms'),
				{
					type: 'snackbar',
					isDismissible: true,
				}
			);
			return;
		}

		// Check if not json file.
		if (file.type !== 'application/json') {
			createErrorNotice(
				__('⛔ Invalid file type! Please upload a JSON file.', 'quillforms'),
				{
					type: 'snackbar',
					isDismissible: true,
				}
			);
			return;
		}

		setIsLoading(true);
		const formData = new FormData();
		formData.append('json_file', file);

		apiFetch({
			path: `/qf/v1/import-export/import`,
			method: 'POST',
			body: formData,
		})
			.then((res) => {
				if (res.success) {
					setFile(null);
					createSuccessNotice(
						__('✅ Form imported successfully!', 'quillforms'),
						{
							type: 'snackbar',
							isDismissible: true,
						}
					);
					// Reload the page to show the new form
					window.location.reload();
				} else {
					createErrorNotice(
						__('⛔ Something went wrong!', 'quillforms'),
						{
							type: 'snackbar',
							isDismissible: true,
						}
					);
				}
				setIsLoading(false);
			})
			.catch(() => {
				createErrorNotice(
					__('⛔ Something went wrong!', 'quillforms'),
					{
						type: 'snackbar',
						isDismissible: true,
					}
				);
				setIsLoading(false);
			});
	};

	const handleClose = () => {
		setFile(null);
		setIsLoading(false);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<Modal
			title={__('Import Form', 'quillforms')}
			onRequestClose={handleClose}
			className="quillforms-import-modal"
		>
			<div className="min-w-[min(100%,560px)] max-w-[800px]">
				<div className="quillforms-import-modal__body">
					<div className="quillforms-import-modal__dropzone">
						<DragDrogIcon
							color={file ? '#64748b' : '#B2328C'}
							width={56}
							height={56}
						/>
						<div className="quillforms-import-modal__primary-row">
							<span>
								{__('Drag & drop your file or', 'quillforms')}
							</span>
							<FormFileUpload
								accept="application/json"
								onChange={(event) => {
									const selectedFile = event.target.files[0];
									if (selectedFile) {
										setFile(selectedFile);
									}
								}}
								render={({ openFileDialog }) => (
									<Button
										variant="secondary"
										onClick={openFileDialog}
										className={
											`quillforms-import-modal__choose-file ${file ? 'has-file' : ''}`
										}
									>
										{__('choose a file', 'quillforms')}
									</Button>
								)}
							/>
						</div>

						<p className="quillforms-import-modal__hint">
							{__('Supported formats: .JSON - Max 50 MB', 'quillforms')}
						</p>
					</div>

					{file && (
						<div className="bg-[#F7F8FA] py-3 px-4 rounded-xl flex flex-col gap-3 border border-[#e2e8f0]">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-1">
									<JsonIcon />
									<span className="text-[13px] font-medium leading-snug text-[#334155]">{file.name}</span>
								</div>
								<button
									onClick={() => setFile(null)}
									className="text-[#EF4444] hover:text-[#DC2626] transition-colors"
									disabled={isLoading}
								>
									<TrashIcon />
								</button>
							</div>
							<div className="relative">
								<div className="w-full h-1 bg-[#E2E8F0] rounded-full overflow-hidden">
									<div className="h-full bg-[#16A34A] rounded-full transition-all duration-300" style={{ width: '100%' }}></div>
								</div>
								<div className="flex items-center justify-between mt-2">
									<div className="flex items-center gap-1">
										<CompleteIcon />
										<span className="text-[13px] font-medium leading-snug text-[#16A34A]">{__('Completed', 'quillforms')}</span>
									</div>
									<span className="text-[13px] font-medium leading-snug text-[#16A34A]">100%</span>
								</div>
							</div>
						</div>
					)}

					<div className="quillforms-import-modal__actions">
						<CustomButton
							variant="outlineSecondary"
							text={__('Cancel', 'quillforms')}
							onClick={handleClose}
							disabled={isLoading}
						/>
						<CustomButton
							variant="primary"
							className="!bg-[#B2328C]"
							text={isLoading ? __('Importing...', 'quillforms') : __('Import Form', 'quillforms')}
							onClick={uploadHandler}
							disabled={isLoading || !file}
						/>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ImportFormModal;

