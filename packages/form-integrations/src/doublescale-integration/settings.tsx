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
		quillformsDoubleScaleIntegration?: {
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

const DoubleScaleSettings: React.FC = () => {
	const adminURL = ConfigAPI.getAdminUrl();
	const integration = window.quillformsDoubleScaleIntegration;

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
			formData.append('action', 'quillforms_install_doublescale');
			formData.append('_nonce', integration?.installNonce || '');

			const response = await fetch(integration?.ajaxUrl || '', {
				method: 'POST',
				body: formData,
				credentials: 'same-origin',
			});

			const data = await response.json();

			if (data.success) {
				setSuccess(__('DoubleScale installed successfully! Now activating...', 'quillforms'));
				setLocalState((prev) => ({ ...prev, isInstalled: true }));
				// Auto-activate after install
				setTimeout(() => handleActivate(), 1000);
			} else {
				setError(data.data || __('Failed to install DoubleScale.', 'quillforms'));
			}
		} catch (err) {
			setError(__('An error occurred while installing DoubleScale.', 'quillforms'));
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
			formData.append('action', 'quillforms_activate_doublescale');
			formData.append('_nonce', integration?.activateNonce || '');

			const response = await fetch(integration?.ajaxUrl || '', {
				method: 'POST',
				body: formData,
				credentials: 'same-origin',
			});

			const data = await response.json();

			if (data.success) {
				setSuccess(__('DoubleScale activated successfully! Reloading...', 'quillforms'));
				setLocalState((prev) => ({ ...prev, isActive: true }));
				// Reload page to reflect changes
				setTimeout(() => window.location.reload(), 1500);
			} else {
				setError(data.data || __('Failed to activate DoubleScale.', 'quillforms'));
			}
		} catch (err) {
			setError(__('An error occurred while activating DoubleScale.', 'quillforms'));
		} finally {
			setIsLoading(false);
		}
	};

	// If DoubleScale is active, show the normal settings
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
						'Configure your DoubleScale integration settings to manage how contacts are created and updated from form submissions.',
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
						'You can map form fields to contact properties, set up tags, and configure automation workflows in the DoubleScale settings.',
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
						href={`${adminURL}admin.php?page=doublescale&path=forms`}
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
						href={`${adminURL}admin.php?page=doublescale&path=automations`}
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
					width="71"
					height="80"
					viewBox="189 -10 355 336"
					fill="none"
					preserveAspectRatio="xMidYMid meet"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill="#7c3aed"
						d="M377.82 260.726C386.76 242.346 380.59 228.176 366.58 216.136C364.06 213.966 361.39 211.956 358.68 210.026C345.67 200.746 332.64 191.496 319.58 182.286C290.85 162.046 277.82 133.756 278.12 99.256C278.53 50.466 313.2 10.616 361.52 1.99603C395.59 -4.07397 426.56 4.02604 455.43 21.866C465.6 28.156 475.28 35.236 485.61 42.236C490.33 32.616 495.19 22.716 500.56 11.776C513.04 42.636 525.16 72.616 537.54 103.236C505.48 98.466 474.13 93.806 441.96 89.026C450.51 81.866 458.49 75.186 466.57 68.426C466.33 67.906 466.26 67.356 465.95 67.116C446.09 51.786 425.43 38.116 400.36 32.516C365.3 24.686 328.12 42.246 314.45 73.486C301.65 102.756 309.94 136.256 335.36 155.506C348.89 165.746 363.16 174.996 376.96 184.896C388.4 193.106 395.73 203.976 397.84 218.186C400 232.746 391.04 252.496 377.84 260.726H377.82Z"
					/>
					<path
						fill="#a78bfa"
						d="M247.9 272.236C242.92 282.256 238.18 291.776 233.43 301.276C233.3 301.546 232.94 301.696 232.23 302.276C219.81 272.606 207.45 243.096 194.76 212.776C226.83 217.416 258.05 221.936 290.51 226.636C281.92 233.576 273.93 240.036 265.34 246.976C268.83 249.616 272.04 252.156 275.35 254.536C293.41 267.516 312.23 278.946 334.39 283.686C366.67 290.596 396.6 279.506 414.38 251.876C433.56 222.076 427.52 182.816 398.23 160.806C384.81 150.716 370.62 141.646 356.96 131.856C345.89 123.916 338.3 113.636 336.07 99.736C333.17 81.646 340.56 68.206 354.38 57.316C350.24 66.656 349.66 75.876 354.41 85.156C358.63 93.406 365.19 99.506 372.55 104.756C387.05 115.096 401.71 125.226 416.31 135.426C439.66 151.756 451.28 174.956 455.1 202.486C461.42 247.946 434.57 294.336 386.57 310.536C359.69 319.606 332.85 317.666 306.51 307.406C286.64 299.666 268.82 288.516 252.15 275.386C250.86 274.366 249.51 273.416 247.92 272.236H247.9Z"
					/>
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
				{__('DoubleScale', 'quillforms')}
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
					'A full-featured CRM from our partner DoubleScale — free on WordPress.org.',
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
						? __('Activate DoubleScale', 'quillforms')
						: __('Install DoubleScale', 'quillforms')}
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
					href="https://wordpress.org/plugins/doublescale/"
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
					{__('Learn more about DoubleScale →', 'quillforms')}
				</a>
			</p>
		</div>
	);
};

export default DoubleScaleSettings;
