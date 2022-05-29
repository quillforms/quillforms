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
					width: 100%;
					height: 100%;
					max-height: 100%;
					max-width: 100%;
					margin-right: 0;
					margin-left: 0;
					margin-top: 0;
					margin-bottom: 0;
					border-radius: 0;

					.components-modal__content {
						padding: 0;
						background: #fafafa;
						&:before {
							display: none;
						}
						.components-modal__header {
							margin: 0 0 45px;

							div {
								justify-content: center;
							}
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
