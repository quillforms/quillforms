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
					<DragDrogIcon />
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
								<div>
									<Button
										variant="secondary"
										onClick={openFileDialog}
										className="w-full !ml-0.5 text-xl font-medium leading-7 text-[#B2328C] "
									>
										{__(' Choose File', 'quillforms')}
									</Button>

									{file && (
										<div className="p-3 bg-[#F1F5F9] rounded-lg mb-4">
											<p className="text-sm text-[#334155] m-0">
												<strong>{__('Selected file:', 'quillforms')}</strong> {file.name}
											</p>
										</div>
									)}
								</div>
							)}
						/>

					</div>

					<p className="text-lg leading-7 text-center text-[#777]">
						{__('Supported formats: .JSON - Max 40 MB', 'quillforms')}
					</p>
				</div>

				<div className="flex gap-3 justify-end">
					<CustomButton
						variant="outlineSecondary"
						text={__('Cancel', 'quillforms')}
						onClick={handleClose}
						disabled={isLoading}
					/>
					<CustomButton
						variant="primary"
						className='!bg-[#777]'
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

