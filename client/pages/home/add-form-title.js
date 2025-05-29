/**
 * QuillForms Dependencies.
 */
import { Button, TextControl } from '@quillforms/admin-components';
import { getHistory, getNewPath } from '@quillforms/navigation';

/**
 * WordPress Dependencies
 */
import { useEffect, useRef, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { Oval as Loader } from 'react-loader-spinner';
import { css } from 'emotion';
import ScratchIcon from './scratch-icon';

const AddFormTitle = ({ 
	closeModal, 
	setCanProceed, 
	setNextButtonText, 
	setNextButtonAction,
	setIsLoading 
}) => {
	const [title, setTitle] = useState('');

	const ref = useRef(null);
	
	useEffect(() => {
		if (ref && ref.current) ref.current.focus();
	}, [ref.current]);

	// Update parent component's next button state when title changes
	useEffect(() => {
		const canProceed = title.trim().length > 0;
		setCanProceed(canProceed);
		setNextButtonText(__('Create Blank Form', 'quillforms'));
		
		// Set the action for the next button
		setNextButtonAction(() => createNewForm);
	}, [title, setCanProceed, setNextButtonText, setNextButtonAction]);

	const createNewForm = async () => {
		if (!title.trim()) return;
		
		setIsLoading(true);
		
		try {
			const res = await apiFetch({
				path: '/wp/v2/quill_forms',
				method: 'POST',
				data: {
					title,
					status: 'draft',
					blocks: [
						{
							id: 'dugnwd99ek',
							name: 'short-text',
							attributes: {},
						},
					],
				},
			});
			
			const { id } = res;
			getHistory().push(getNewPath({}, `/forms/${id}/builder`));
		} catch (error) {
			console.error('Error creating form:', error);
			setIsLoading(false);
		}
	};

	return (
		<div
			className={css`
				width: 100%;
			`}
		>
			<div
				className={css`
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					gap: 1.5rem;
					margin: 10rem auto;
				`}
			>
				<ScratchIcon />
				<h1>{__('Start From Scratch', 'quillforms')}</h1>
				<div
					className={css`
						width: 45rem;
						font-size: 16px;
						font-weight: 600;
					`}
				>
					<label htmlFor="form-title">{__('Form Title', 'quillforms')}</label>
					<input
						className={css`
							margin-top: 10px;
							border: 1px solid #e0e0e0;
							border-radius: 12px;
						`}
						name="form-title"
						type="text"
						placeholder={__('Insert Form Title here!', 'quillforms')}
						ref={ref}
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						onKeyPress={(e) => {
							if (e.key === 'Enter' && title.trim()) {
								createNewForm();
							}
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default AddFormTitle;