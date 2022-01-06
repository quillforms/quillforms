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
import Loader from 'react-loader-spinner';
import { css } from 'emotion';

const AddFormModalContent = ( { closeModal } ) => {
	const [ title, setTitle ] = useState( '' );
	const [ isCreating, setIsCreating ] = useState( false );

	const ref = useRef( null );
	useEffect( () => {
		if ( ref && ref.current ) ref.current.focus();
	}, [ ref.current ] );

	const createNewForm = () => {
		setIsCreating( true );
		// Post
		apiFetch( {
			path: '/wp/v2/quill_forms',
			method: 'POST',
			data: {
				title,
			},
		} ).then( ( res ) => {
			const { id } = res;
			getHistory().push( getNewPath( {}, `/forms/${ id }/builder` ) );
		} );
	};
	return (
		<>
			<div
				className={ css`
					margin-bottom: 20px;
				` }
			>
				Form Title
				<TextControl
					ref={ ref }
					value={ title }
					onChange={ ( val ) => setTitle( val ) }
				/>
			</div>
			<div className="quillforms-home__add-form-modal-footer">
				<Button
					isDefault
					className={ css`
						margin-right: 10px !important;
					` }
					onClick={ closeModal }
				>
					Cancel
				</Button>
				<Button
					className={ css`
						width: 70px;
						display: flex;
						justify-content: center;
						align-items: center;
					` }
					onClick={ () => {
						if ( ! isCreating ) {
							createNewForm();
						}
					} }
					isPrimary
				>
					{ isCreating ? (
						<Loader
							className={ css`
								display: flex;
								justify-content: center;
								align-items: center;
							` }
							type="Oval"
							color="#fff"
							height={ 15 }
							width={ 15 }
						/>
					) : (
						'Create'
					) }
				</Button>
			</div>
		</>
	);
};

export default AddFormModalContent;
