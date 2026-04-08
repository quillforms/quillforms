/**
 * WordPress Dependencies.
 */
import { Modal } from '@wordpress/components';
import { useRef, useState, useEffect } from 'react';
/**
 * External Dependencies
 */
import { css } from 'emotion';
import classnames from 'classnames';
import { Oval as Loader } from 'react-loader-spinner';

/**
 * Internal Dependencies
 */
import Button from '../button';

interface Props {
	onCloseModal: () => void;
	onInsert: ( val: string ) => void;
}
const ChoicesBulkModal: React.FC< Props > = ( { onCloseModal, onInsert } ) => {
	const [ isInserting, setIsInserting ] = useState( false );
	const [ bulkChoicesTxt, setBulkChoicesTxt ] = useState( '' );
	const ref = useRef< HTMLTextAreaElement | null >( null );

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
					min-width: 350px !important;
					border-radius: 10px;
					z-index: 1111111;

					.components-modal__content {
						display: flex;
						flex-direction: column;
						justify-content: center;
						background: #FFF;
						margin-top: 54px;
						min-height: 300px;
					}

					.components-modal__header {
						background: #FFF;
						.components-modal__header-heading {
							color: #334155;
						}
						.components-button.has-icon svg {
							fill: #334155;
						}
					}
				`
			) }
			title="Bulk Choices"
			onRequestClose={ onCloseModal }
		>
			<p
				className={ css`
					marging-bottom: 10px;
					font-size: 16px !important;
					font-weight: 500 !important;
					line-height: 24px !important;
					color: #334155 !important;
				` }
			>
				Insert each answer choice in a separate line
			</p>
			<textarea
				ref={ ref }
				className={ css`
					width: 100%;
					height: 170px;
					overflow-y: auto;
					resize: none;
					border: 1px solid #D9D9D9;
					border-radius: 8px;
					padding: 16px;
					font-size: 16px;
					font-weight: 400;
					line-height: 24px;
					color: #334155;
					margin-top: 10px;
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
						border: 1px solid #D9D9D9 !important;
						border-radius: 8px !important;
						padding: 8px 12px !important;
						height: auto !important;
						font-size: 16px !important;
						font-weight: 500 !important;
						line-height: 24px !important;
						color: #334155 !important;
					` }
					onClick={ onCloseModal }
				>
					Cancel
				</Button>
				<Button
					isPrimary
					isButton
					isDefault
					className={ classnames(
						'admin-components-choices-bulk-modal__done',
						css`
							display: inline-flex;
							justify-content: center;
							align-items: center;
							min-width: 70px;
						`
					) }
					onClick={ () => {
						if ( isInserting ) return;
						setIsInserting( true );
						onInsert( bulkChoicesTxt );
						setTimeout( () => {
							setIsInserting( false );
							onCloseModal();
						}, 0 );
					} }
				>
					Done
					<>
						{ isInserting && (
							<div
								className={ css`
									display: flex;
									justify-content: center;
									align-items: center;
									margin: 0px 10px;
								` }
							>
								<Loader
									color="#ffffff"
									height={ 15 }
									width={ 15 }
								/>
							</div>
						) }
					</>
				</Button>
			</div>
		</Modal>
	);
};

export default ChoicesBulkModal;
