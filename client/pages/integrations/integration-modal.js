/**
 * WordPress Dependencies
 */
import { Modal } from '@wordpress/components';

/**
 * External Dependencies
 */
import { css } from 'emotion';

const IntegrationModal = ( { slug, integration, onClose } ) => {
	return (
		<Modal
			title={ integration.title }
			focusOnMount={ true }
			onRequestClose={ onClose }
			className={ css`
				width: 750px;
			` }
		>
			<integration.render slug={ slug } />
		</Modal>
	);
};

export default IntegrationModal;
