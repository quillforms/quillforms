/**
 * WordPress Dependencies.
 */
import { Modal } from '@wordpress/components';
import { useRef, useState, useEffect } from '@wordpress/element';
/**
 * External Dependencies
 */
import { css } from 'emotion';
import classnames from 'classnames';
import Loader from 'react-loader-spinner';

/**
 * Internal Dependencies
 */
import Button from '../button';

const ChoicesBulkModal = ( { closeModal, onInsert } ) => {
	const [ isInserting, setIsInserting ] = useState( false );
	const [ bulkChoicesTxt, setBulkChoicesTxt ] = useState( '' );
	const ref = useRef();

	useEffect( () => {
		if ( ref?.current ) {
			ref.current.focus();
		}
	} );
	return (
		<Modal
			className={ classnames(
				'admin-components-choices-bulk-modal',
				css`
					border: none !important;
					min-width: 420px !important;
					border-radius: 10px;
				`
			) }
			title="Bulk Choices"
			onRequestClose={ closeModal }
		>
			<p
				className={ css`
					marging-bottom: 10px;
				` }
			>
				<strong>Insert each answer choice in a separate line </strong>
			</p>
			<textarea
				ref={ ref }
				className={ css`
					width: 100%;
					height: 170px;
					overflow-y: auto;
					resize: none;
				` }
				onChange={ ( e ) => setBulkChoicesTxt( e.target.value ) }
				value={ bulkChoicesTxt }
			/>
			<div
				className={ css`
					display: flex;
					margin-top: 10px;
					justify-content: flex-end;
				` }
			>
				<Button
					isDefault
					isLarge
					className={ css`
						margin-right: 10px !important;
					` }
					onClick={ closeModal }
				>
					Cancel
				</Button>
				<Button
					isLarge
					className={ css`
						width: 70px;
						display: flex;
						justify-content: center;
						align-items: center;
					` }
					onClick={ () => {
						if ( isInserting ) return;
						setIsInserting( true );
						onInsert( bulkChoicesTxt );
						setTimeout( () => {
							setIsInserting( false );
							closeModal();
						}, 0 );
					} }
					isPrimary
				>
					Done
					<>
						{ isInserting && (
							<Loader
								className={ css`
									display: flex;
									justify-content: center;
									align-items: center;
									margin: 0px 10px;
								` }
								type="Oval"
								color="#00BFFF"
								height={ 15 }
								width={ 15 }
							/>
						) }
					</>
				</Button>
			</div>
		</Modal>
	);
};

export default ChoicesBulkModal;
