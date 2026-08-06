/**
 * QuillForms Dependencies
 */
import { ErrorBoundary } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { Modal, Icon as IconComponent } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { css } from 'emotion';

const IntegrationModal = ({ slug, integration, onClose }) => {
	const icon = integration.icon;
	const IntegrationRender = integration.render;
	const title = (
		<div
			className={css`
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
			{typeof icon === 'string' ? (
				<img src={icon} />
			) : (
				<IconComponent icon={icon?.src ? icon.src : icon} />
			)}{' '}
			{integration.title}
		</div>
	);

	return (
		<Modal
			title={title}
			focusOnMount={true}
			className={
				`integration-modal integration-modal-${slug} ` +
				css`
					width: 100% !important;
					height: 100% !important;
					max-height: 100%;
					max-width: 100%;
					margin-right: 0;
					margin-left: 0;
					margin-top: 0;
					margin-bottom: 0;
					border-radius: 0;

					.components-modal__content {
						padding: 20px 0 0;
						margin-top: 60px;
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
			onRequestClose={onClose}
			shouldCloseOnEsc={false}
			shouldCloseOnClickOutside={false}
		>
			<ErrorBoundary
				errorConfig={{
					title: __('Unable to load this integration', 'quillforms'),
					message: __(
						'Something went wrong while loading the integration settings. Please try again or contact support if the problem persists.',
						'quillforms'
					),
					actionLabel: __('Close', 'quillforms'),
				}}
				onReset={onClose}
			>
				<IntegrationRender slug={slug} onClose={onClose} />
			</ErrorBoundary>
		</Modal>
	);
};

export default IntegrationModal;
