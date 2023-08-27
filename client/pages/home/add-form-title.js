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

/**
 * External Dependencies
 */
import { Oval as Loader } from 'react-loader-spinner';
import { css } from 'emotion';

const AddFormTitle = ({ closeModal }) => {
	const [title, setTitle] = useState('');
	const [isCreating, setIsCreating] = useState(false);

	const ref = useRef(null);
	useEffect(() => {
		if (ref && ref.current) ref.current.focus();
	}, [ref.current]);

	const createNewForm = () => {
		setIsCreating(true);
		// Post
		apiFetch({
			path: '/wp/v2/quill_forms',
			method: 'POST',
			data: {
				title,
			},
		}).then((res) => {
			const { id } = res;
			getHistory().push(getNewPath({}, `/forms/${id}/builder`));
		});
	};
	return (
		<div className={css`
			width: 100%;
		`}>
			<div
				className={css`
					margin-bottom: 20px;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
				` }
			>
				<h2> Form Title </h2>
				<input
					type="text"
					placeholder='Insert Form Title here!'
					ref={ref}
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
			</div>
			<div className="quillforms-home__add-form-modal-footer">
				<Button
					isDefault
					className={css`
						margin-right: 10px !important;
					` }
					onClick={closeModal}
				>
					Cancel
				</Button>
				<Button
					className={css`
						width: 70px;
						display: flex;
						justify-content: center;
						align-items: center;
						width: 100%;
						max-width: 800px;
					` }
					onClick={() => {
						if (!isCreating) {
							createNewForm();
						}
					}}
					isPrimary
				>
					{isCreating ? (
						<Loader
							className={css`
								display: flex;
								justify-content: center;
								align-items: center;
							` }
							color="#fff"
							height={15}
							width={15}
						/>
					) : (
						'Create'
					)}
				</Button>
			</div>
		</div>
	);
};

export default AddFormTitle;
