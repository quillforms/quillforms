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
			className="quillforms-import-modal text-[#334155] text-2xl font-medium p-6 "

		>
			<div className=" rounded-2xl min-w-[800px]  flex flex-col gap-4 ">
				<div className="bg-[#F7F8FA]  py-4 px-6 rounded-2xl border border-border-color text-center flex flex-col justify-center items-center gap-3">
					<DragDrogIcon color={file ? '#777' : '#B2328C'} />
					<div className='flex justify-center items-center'>
						<p className="text-xl font-bold leading-7 text-[#334155] ">
							{__('Drag & drop your file or ', 'quillforms')}
							{' '}
						</p>
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
									className={`w-full !ml-0.5 text-xl font-medium leading-7 ${file ? 'text-[#777]' : ' text-[#B2328C]'}`}
								>
									{__(' choose a file', 'quillforms')}
								</Button>
							)}
						/>

					</div>

					<p className="text-lg leading-7 text-center text-[#777]">
						{__('Supported formats: .JSON - Max 50 MB', 'quillforms')}
					</p>
				</div>

				{file && (
					<div className="bg-[#F7F8FA] py-4 px-6 rounded-2xl flex flex-col gap-4 border border-border-color">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-1">
							    <JsonIcon />
								<span className="text-lg font-medium leading-7 text-[#334155]">{file.name}</span>
							</div>
							<button
								onClick={() => setFile(null)}
								className="text-[#EF4444] hover:text-[#DC2626] transition-colors"
								disabled={isLoading}
							>
								<TrashIcon/>
							</button>
						</div>
						<div className="relative">
							<div className="w-full h-1 bg-[#E2E8F0] rounded-full overflow-hidden">
								<div className="h-full bg-[#16A34A] rounded-full transition-all duration-300" style={{ width: '100%' }}></div>
							</div>
							<div className="flex items-center justify-between mt-2">
								<div className="flex items-center gap-1">
									<CompleteIcon/>
									<span className="text-lg font-medium leading-7 text-[#16A34A]">{__('Completed', 'quillforms')}</span>
								</div>
								<span className="text-lg font-medium leading-7 text-[#16A34A]">100%</span>
							</div>
						</div>
					</div>
				)}

				<div className="flex gap-3 justify-end">
					<CustomButton
						variant="outlineSecondary"
						text={__('Cancel', 'quillforms')}
						onClick={handleClose}
						disabled={isLoading}
					/>
					<CustomButton
						variant="primary"
						className='!bg-[#B2328C]'
						text={isLoading ? __('Importing...', 'quillforms') : __('Import Form', 'quillforms')}
						onClick={uploadHandler}
						disabled={isLoading || !file}
					/>
				</div>
			</div>
		</Modal>
	);
};

export default ImportFormModal;

