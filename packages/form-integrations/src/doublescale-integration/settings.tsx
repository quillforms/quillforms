/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * QuillForms Dependencies
 */
import ConfigAPI from '@quillforms/config';

/**
 * External Dependencies
 */
import { css, keyframes } from 'emotion';

declare global {
	interface Window {
		quillformsQuillCRMIntegration?: {
			isInstalled: boolean;
			isActive: boolean;
			installNonce: string;
			activateNonce: string;
			ajaxUrl: string;
		};
	}
}

const spin = keyframes`
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
`;

const QuillCRMSettings: React.FC = () => {
	const adminURL = ConfigAPI.getAdminUrl();
	const integration = window.quillformsQuillCRMIntegration;

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [localState, setLocalState] = useState({
		isInstalled: integration?.isInstalled || false,
		isActive: integration?.isActive || false,
	});

	const handleInstall = async () => {
		setIsLoading(true);
		setError(null);
		setSuccess(null);

		try {
			const formData = new FormData();
			formData.append('action', 'quillforms_install_quillcrm');
			formData.append('_nonce', integration?.installNonce || '');

			const response = await fetch(integration?.ajaxUrl || '', {
				method: 'POST',
				body: formData,
				credentials: 'same-origin',
			});

			const data = await response.json();

			if (data.success) {
				setSuccess(__('QuillCRM installed successfully! Now activating...', 'quillforms'));
				setLocalState((prev) => ({ ...prev, isInstalled: true }));
				// Auto-activate after install
				setTimeout(() => handleActivate(), 1000);
			} else {
				setError(data.data || __('Failed to install QuillCRM.', 'quillforms'));
			}
		} catch (err) {
			setError(__('An error occurred while installing QuillCRM.', 'quillforms'));
		} finally {
			setIsLoading(false);
		}
	};

	const handleActivate = async () => {
		setIsLoading(true);
		setError(null);
		setSuccess(null);

		try {
			const formData = new FormData();
			formData.append('action', 'quillforms_activate_quillcrm');
			formData.append('_nonce', integration?.activateNonce || '');

			const response = await fetch(integration?.ajaxUrl || '', {
				method: 'POST',
				body: formData,
				credentials: 'same-origin',
			});

			const data = await response.json();

			if (data.success) {
				setSuccess(__('QuillCRM activated successfully! Reloading...', 'quillforms'));
				setLocalState((prev) => ({ ...prev, isActive: true }));
				// Reload page to reflect changes
				setTimeout(() => window.location.reload(), 1500);
			} else {
				setError(data.data || __('Failed to activate QuillCRM.', 'quillforms'));
			}
		} catch (err) {
			setError(__('An error occurred while activating QuillCRM.', 'quillforms'));
		} finally {
			setIsLoading(false);
		}
	};

	// If QuillCRM is active, show the normal settings
	if (localState.isActive) {
		return (
			<div
				className={css`
					text-align: center;
					padding: 20px;
				`}
			>
				<p
					className={css`
						font-size: 15px;
						color: #374151;
						margin-bottom: 16px;
						line-height: 1.6;
					`}
				>
					{__(
						'Configure your QuillCRM integration settings to manage how contacts are created and updated from form submissions.',
						'quillforms'
					)}
				</p>
				<p
					className={css`
						font-size: 14px;
						color: #6b7280;
						margin-bottom: 24px;
						line-height: 1.5;
					`}
				>
					{__(
						'You can map form fields to contact properties, set up tags, and configure automation workflows in the QuillCRM settings.',
						'quillforms'
					)}
				</p>
				<div
					className={css`
						display: flex;
						gap: 12px;
						justify-content: center;
						flex-wrap: wrap;
					`}
				>
					<a
						href={`${adminURL}admin.php?page=quillcrm&path=forms`}
						className={css`
							display: inline-block;
							background: linear-gradient(135deg, #274c77 0%, #4f9ef9 100%);
							color: #fff !important;
							padding: 12px 24px;
							border-radius: 6px;
							text-decoration: none;
							font-weight: 500;
							transition: all 0.2s ease;

							&:hover {
								transform: translateY(-2px);
								box-shadow: 0 4px 12px rgba(39, 76, 119, 0.3);
							}
						`}
					>
						{__('Form Settings', 'quillforms')}
					</a>
					<a
						href={`${adminURL}admin.php?page=quillcrm&path=automations`}
						className={css`
							display: inline-block;
							background: #fff;
							color: #274c77 !important;
							padding: 12px 24px;
							border-radius: 6px;
							text-decoration: none;
							font-weight: 500;
							border: 2px solid #274c77;
							transition: all 0.2s ease;

							&:hover {
								background: #e0f2ff;
								transform: translateY(-2px);
							}
						`}
					>
						{__('Automations', 'quillforms')}
					</a>
				</div>
			</div>
		);
	}

	// If not active, show install/activate UI
	return (
		<div
			className={css`
				text-align: center;
				padding: 30px 20px;
			`}
		>
			{/* Icon */}
			<div
				className={css`
					margin-bottom: 24px;
				`}
			>
				<svg
					width="62"
					height="80"
					viewBox="0 0 31 40"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M20.0712 6.96015C20.3818 5.2492 20.649 3.84346 22.1758 2.78639C23.5446 1.83888 28.8932 -0.520354 30.4288 0.103593C30.843 0.893149 30.1149 3.30436 29.8723 4.15913C28.8002 7.93748 27.8094 7.48079 25.2604 9.46894C26.3529 9.16181 27.3478 8.67034 28.3794 8.19952C27.9322 9.3799 27.3182 11.0463 26.6293 12.0705C25.5832 15.3795 22.2915 17.7543 19.7036 19.6619C21.4093 19.2432 21.9191 19.0244 23.486 18.1972C21.8062 22.6683 20.1795 24.2845 16.521 27.0469C17.5615 26.8718 18.0588 26.7503 19.069 26.4357C17.519 28.7447 14.5016 30.8084 12.1526 32.2364C11.7178 33.5702 10.433 39.1778 9.98406 39.8925L9.79973 39.8161C9.66432 39.346 10.0214 37.3116 10.1381 36.7383C12.4702 25.2723 16.8309 15.4661 23.9489 6.26028L23.6861 5.98589C22.721 6.97162 22.0093 7.77187 21.1684 8.86882C20.9737 9.1227 19.754 10.6854 19.6472 10.7763C19.5176 10.2236 20.4465 9.47417 20.8658 8.76678L20.7476 8.48996C20.393 8.3799 20.1856 8.29569 19.8513 8.15276C19.412 7.41697 19.7911 6.00869 19.3991 4.94907L19.6006 4.81888C19.7858 5.16053 19.8053 6.42232 19.8797 6.95557L20.0712 6.96015Z"
						fill="#458DC7"
					/>
					<path
						d="M20.0713 6.96015C20.3819 5.2492 20.6491 3.84346 22.1759 2.78639C23.5447 1.83888 28.8934 -0.520354 30.4289 0.103593C30.8432 0.893149 30.115 3.30436 29.8725 4.15913C28.8004 7.93748 27.8096 7.48079 25.2605 9.46894C26.353 9.16181 27.3479 8.67034 28.3795 8.19952C27.9324 9.3799 27.3183 11.0463 26.6294 12.0705C26.5955 11.0626 27.6893 9.96614 27.8121 8.87238C27.4908 8.58678 26.2875 9.82117 25.3835 9.62257L25.2614 9.42104C25.3543 8.99582 25.3959 9.00168 25.6975 8.6999C26.6164 8.49811 28.0949 7.2134 28.7115 6.51225L28.831 6.37442C26.8661 3.95952 26.7319 4.52831 25.2494 1.46691C22.7886 2.51315 21.1419 3.18971 20.5335 5.95506C20.4318 6.41735 20.3826 6.66627 20.0713 6.96015Z"
						fill="#458DC7"
					/>
					<path
						d="M25.9153 3.73535C25.4065 4.65892 24.6733 5.49306 23.9488 6.26007L23.686 5.98567C24.4138 5.22057 25.1571 4.47038 25.9153 3.73535Z"
						fill="white"
					/>
					<path
						d="M11.609 4.21103C13.1768 3.96352 16.0576 4.30087 17.6276 4.51679C16.1495 5.9252 15.5263 6.53766 14.3241 8.23588C6.07539 8.18097 4.32991 12.6278 5.14316 20.4084C5.33029 22.1984 6.15794 23.5259 7.23921 24.9352C7.26533 26.8033 7.488 27.8211 8.08354 29.5638C8.22048 29.8479 8.20953 29.8593 8.29373 30.1689L8.10966 30.3026C6.97029 30.2733 4.9038 28.9842 4.05029 28.2593C1.62431 26.1398 0.426352 23.0289 0.119345 19.8992C-0.702438 11.522 2.67615 4.99295 11.609 4.21103Z"
						fill="url(#paint0_linear_settings)"
					/>
					<path
						d="M19.399 4.94922C19.791 6.00884 19.4119 7.41712 19.8512 8.15291C20.1855 8.29584 20.3929 8.38005 20.7475 8.49011L20.8657 8.76693C20.4464 9.47431 19.5175 10.2237 19.6472 10.7765C18.6254 12.4358 17.358 14.0669 16.3916 15.8031C13.7619 20.5274 11.696 25.742 10.347 30.9639C8.67813 27.0663 8.61186 25.9751 8.7632 21.8687C9.25276 22.9947 9.68537 23.8574 10.2501 24.9351C9.0953 20.4023 10.1612 17.2355 12.5154 13.1958C12.8026 14.4279 12.8977 15.416 13.2516 16.7538C13.3408 16.0742 13.4428 14.7376 13.4536 14.0179C13.5087 10.3653 16.7024 7.2296 19.399 4.94922Z"
						fill="#274C77"
					/>
					<path
						d="M27.4144 13.5435C27.7239 13.8519 27.8093 14.5947 27.8796 15.0265C28.886 21.2045 26.4398 27.946 20.3942 30.5128C18.8866 31.1523 17.71 31.3561 16.1101 31.6096L15.8521 31.4861C16.0151 31.1676 17.6481 30.1332 18.1849 29.5944C19.1123 28.6619 19.5151 28.3319 20.2634 27.2828C20.9451 26.8007 20.589 25.5809 20.7857 25.3818C23.2694 22.8684 24.5262 20.3274 25.3705 16.9097C25.419 16.7135 27.089 14.1533 27.4144 13.5435Z"
						fill="#274C77"
					/>
					<defs>
						<linearGradient
							id="paint0_linear_settings"
							x1="-1.41068"
							y1="24.5863"
							x2="21.5158"
							y2="15.9668"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="#274C77" />
							<stop offset="1" stopColor="#4F9EF9" />
						</linearGradient>
					</defs>
				</svg>
			</div>

			<h3
				className={css`
					font-size: 20px;
					font-weight: 600;
					color: #274c77;
					margin: 0 0 12px 0;
				`}
			>
				{__('Quill CRM', 'quillforms')}
			</h3>

			<p
				className={css`
					font-size: 15px;
					color: #374151;
					margin-bottom: 8px;
					line-height: 1.6;
				`}
			>
				{__(
					'The official CRM built by the Quill Forms team.',
					'quillforms'
				)}
			</p>

			<p
				className={css`
					font-size: 14px;
					color: #6b7280;
					margin-bottom: 24px;
					line-height: 1.5;
				`}
			>
				{__(
					'Manage contacts, create pipelines, set up automations, send email & SMS campaigns, and more — all seamlessly integrated with your forms.',
					'quillforms'
				)}
			</p>

			{/* Error message */}
			{error && (
				<div
					className={css`
						background: #fef2f2;
						border: 1px solid #fecaca;
						color: #dc2626;
						padding: 12px 16px;
						border-radius: 8px;
						margin-bottom: 16px;
						font-size: 14px;
					`}
				>
					{error}
				</div>
			)}

			{/* Success message */}
			{success && (
				<div
					className={css`
						background: #f0fdf4;
						border: 1px solid #bbf7d0;
						color: #16a34a;
						padding: 12px 16px;
						border-radius: 8px;
						margin-bottom: 16px;
						font-size: 14px;
					`}
				>
					{success}
				</div>
			)}

			{/* Action button */}
			<button
				onClick={localState.isInstalled ? handleActivate : handleInstall}
				disabled={isLoading}
				className={css`
					display: inline-flex;
					align-items: center;
					justify-content: center;
					gap: 8px;
					background: linear-gradient(135deg, #274c77 0%, #4f9ef9 100%);
					color: #fff;
					padding: 14px 32px;
					border-radius: 8px;
					border: none;
					font-size: 16px;
					font-weight: 600;
					cursor: ${isLoading ? 'not-allowed' : 'pointer'};
					opacity: ${isLoading ? 0.7 : 1};
					transition: all 0.2s ease;
					min-width: 200px;

					&:hover:not(:disabled) {
						transform: translateY(-2px);
						box-shadow: 0 6px 20px rgba(39, 76, 119, 0.35);
					}

					&:active:not(:disabled) {
						transform: translateY(0);
					}
				`}
			>
				{isLoading && (
					<span
						className={css`
							display: inline-block;
							width: 16px;
							height: 16px;
							border: 2px solid rgba(255, 255, 255, 0.3);
							border-top-color: #fff;
							border-radius: 50%;
							animation: ${spin} 0.8s linear infinite;
						`}
					/>
				)}
				{isLoading
					? localState.isInstalled
						? __('Activating...', 'quillforms')
						: __('Installing...', 'quillforms')
					: localState.isInstalled
						? __('Activate QuillCRM', 'quillforms')
						: __('Install QuillCRM', 'quillforms')}
			</button>

			{/* Learn more link */}
			<p
				className={css`
					margin-top: 20px;
					font-size: 13px;
					color: #6b7280;
				`}
			>
				<a
					href="https://quillcrm.com"
					target="_blank"
					rel="noopener noreferrer"
					className={css`
						color: #4f9ef9;
						text-decoration: none;
						&:hover {
							text-decoration: underline;
						}
					`}
				>
					{__('Learn more about QuillCRM →', 'quillforms')}
				</a>
			</p>
		</div>
	);
};

export default QuillCRMSettings;
