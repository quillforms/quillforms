/**
 * WordPress Dependencies
 */
import { Modal } from '@wordpress/components';

/**
 * External Dependencies
 */
import { css } from 'emotion';

const IntegrationModal = ( { slug, integration, onClose } ) => {
	const icon = integration.icon;
	const title = (
		<div
			className={ css`
				display: flex;
				align-items: center;

				svg,
				img {
					width: 40px;
					height: 40px;
					margin-right: 0.5rem;
				}
			` }
		>
			{ typeof icon === 'string' ? (
				<img src={ icon } />
			) : (
				<IconComponent icon={ icon?.src ? icon.src : icon } />
			) }{ ' ' }
			{ integration.title }
		</div>
	);

	return (
		<Modal
			title={ title }
			focusOnMount={ true }
			className={
				`integration-modal integration-modal-${ slug } ` +
				css`
					width: 750px;

					.components-modal__content {
						padding: 0;

						.components-modal__header {
							margin: 0 0 45px;
						}
					}
					.components-modal__header
						.components-modal__header-heading {
						font-size: 1rem;
						/* font-weight: 600; */
						font-family: 'Roboto', sans-serif;
						font-weight: 300;
						font-size: 20px;
					}
				`
			}
			onRequestClose={ onClose }
			shouldCloseOnEsc={ false }
			shouldCloseOnClickOutside={ false }
		>
			<integration.render slug={ slug } onClose={ onClose } />
		</Modal>
	);
};

export default IntegrationModal;
