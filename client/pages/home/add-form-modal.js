/**
 * WordPress Dependencies.
 */
import { Modal } from '@wordpress/components';

/**
 * External Dependencies.
 */
import { css } from 'emotion';
import classnames from 'classnames';
import AddFormModalContent from './add-form-modal-content';

const AddFormModal = ( { closeModal } ) => {
	return (
		<Modal
			className={ classnames(
				'quillforms-home__add-form-modal',
				css`
					border: none !important;
					border-radius: 9px;

					.components-modal__header {
						background: linear-gradient( 42deg, #9236eb, #b916ee );
						h1 {
							color: #fff;
						}
						svg {
							fill: #fff;
						}
					}
				`
			) }
			title="Create new form"
			onRequestClose={ closeModal }
			focusOnMount={ true }
		>
			<AddFormModalContent closeModal={ closeModal } />
		</Modal>
	);
};

export default AddFormModal;
