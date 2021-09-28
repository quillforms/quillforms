/**
 * WordPress Dependencies
 */
import { Modal } from '@wordpress/components';

/**
 * External Dependencies
 */
import { css } from 'emotion';

const IntegrationModal = ( { integration, onClose } ) => {
	return (
		<Modal
			title={ integration.title }
			focusOnMount={ true }
			onRequestClose={ onClose }
			className={ css`
				width: 900px;
			` }
		>
			<integration.render />
		</Modal>
	);
};

export default IntegrationModal;
