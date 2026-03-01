/**
 * WordPress Dependencies
 */
import { Modal, Icon as IconComponent } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import CustomButton from '../../components/custom-button';
import lockImage from '../../../assets/images/lock.png';

const IntegrationModal = ({ slug, integration, onClose, isConnected = false }) => {
	const icon = integration.icon;
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

	const featureAvailabilityContent = (
		<div
			className={css`
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				height: 100%;
				padding: 60px 40px;
				text-align: center;
			`}
		>
			<img
				src={lockImage}
				alt="Lock"
				className={css`
					width: 300px;
					height: 200px;
					object-fit: contain;
					margin: 0 auto 16px;
					display: block;
				`}
			/>
			<p
				className={css`
					font-size: 18px;
					line-height: 28px;
					color: #777;
					margin: 0 0 16px;
					font-weight: 500;
				`}
			>
				{__(
					`We're sorry, ${integration.title} is not available on your plan. Please upgrade to the Basic plan to unlock all of Basic features`,
					'quillforms'
				)}
			</p>
			<div
				className={css`
					display: flex;
					justify-content: center;
					width: 100%;
					margin-top: 16px;
				`}
			>
				<CustomButton
					text={__('Upgrade to Basic!', 'quillforms')}
					variant="primary"
					onClick={() => {
						window.open('https://quillforms.com', '_blank');
					}}
					className={css`
						font-size: 18px !important;
						padding: 12px 96px !important;
						border-radius: 16px !important;
					`}
				/>
			</div>
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
					    padding: 20px 0;
						margin-top: 60px;
						background: #fafafa;
						&:before {
							display: none;
						}
						.components-modal__header {
							margin: 0 0 45px;
							padding: 20px 0;
							box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);

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
			{isConnected ? (
				<integration.render slug={slug} onClose={onClose} />
			) : (
				featureAvailabilityContent
			)}
		</Modal>
	);
};

export default IntegrationModal;
