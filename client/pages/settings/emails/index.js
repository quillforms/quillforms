/**
 * QuillForms Dependencies.
 */
import { setForceReload } from '@quillforms/navigation';
import CustomButton from '../../../components/custom-button';

/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
import { useState, useEffect, useRef } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { MediaUpload } from '@wordpress/media-utils';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { ThreeDots as Loader } from 'react-loader-spinner';
import { isEmpty } from 'lodash';
import WarningIcon from '../../../components/icon/warning-icon';
import UploadIcon from '../../../components/icon/upload-icon';

/**
 * Internal Dependencies
 */
import './style.scss';
import AddIcon from '../../../components/icon/add-icon';

// Predefined palette colors
const PALETTE_COLORS = [
	'#fce7f3', '#ef4444', '#f97316', '#f59e0b',
	'#34d399', '#14b8a6', '#7dd3fc', '#3b82f6',
	'#8b5cf6', '#a855f7', '#d1d5db', '#1e293b',
];

// Custom color palette
const CustomColorPalette = ({ value, onChange }) => {
	const colorInputRef = useRef(null);

	return (
		<div className="emails-color-palette-wrapper">
			<div className="flex items-center gap-2 flex-wrap">
				<button
					onClick={() => colorInputRef.current?.click()}
					className="w-8 h-8 rounded-[8px] p-2 border border-[#B2328C] bg-white text-[#B2328C] text-xl font-bold flex items-center justify-center cursor-pointer hover:bg-pink-50 transition-colors flex-shrink-0"
					title={__('Pick custom color', 'quillforms')}
				>
					<AddIcon />
					<input
						ref={colorInputRef}
						type="color"
						value={value || '#ffffff'}
						onChange={(e) => onChange(e.target.value)}
						className="sr-only"
					/>
				</button>
				{ /* Preset swatches */}
				{PALETTE_COLORS.map((color) => (
					<button
						key={color}
						onClick={() => onChange(color)}
						title={color}
						style={{ backgroundColor: color }}
						className={[
							'w-8 h-8 rounded-[8px] cursor-pointer flex-shrink-0 transition-transform hover:scale-110',
							value === color
								? 'ring-2 ring-offset-1 ring-[#B2328C]'
								: '',
						].join(' ')}
					/>
				))}
			</div>
			{ /* Clear */}
			<button
				onClick={() => onChange(undefined)}
				className="ml-auto text-sm text-gray-500 hover:text-gray-700 cursor-pointer bg-[#fff] border border-border-color rounded-[8px] px-3 py-2 transition-colors"
			>
				{__('Clear', 'quillforms')}
			</button>
		</div>
	);
};

// Trash icon
const TrashIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<polyline points="3 6 5 6 21 6" />
		<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
		<path d="M10 11v6M14 11v6" />
		<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
	</svg>
);

const Emails = () => {
	const [settings, setSettings] = useState(null);
	const [isSaving, setIsSaving] = useState(false);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch('core/notices');

	const setSettingField = (key, value) => {
		setSettings((prev) => ({ ...prev, [key]: value }));
	};

	useEffect(() => {
		apiFetch({ path: `/qf/v1/settings?groups=emails`, method: 'GET' })
			.then((res) => setSettings(res.emails))
			.catch(() => setSettings(false));
	}, []);

	const save = () => {
		setIsSaving(true);
		apiFetch({ path: `/qf/v1/settings`, method: 'POST', data: settings })
			.then(() => {
				createSuccessNotice('✅ Settings saved', {
					type: 'snackbar',
					isDismissible: true,
				});
				setIsSaving(false);
				setForceReload(true);
			})
			.catch((err) => {
				createErrorNotice(`⛔ ${err ?? 'Error'}`, {
					type: 'snackbar',
					isDismissible: true,
				});
				setIsSaving(false);
			});
	};

	return (
		<div className="quillforms-settings-emails-tab">
			{settings === null ? (
				<div className="flex justify-center items-center h-24">
					<Loader color="#8640e3" height={50} width={50} />
				</div>
			) : !settings ? (
				<div className="text-red-500 p-4">
					{__('Cannot load settings', 'quillforms')}
				</div>
			) : (
				<div>
					{ /* ── Two-column grid ── */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

						{ /* Header Image card */}
						<div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 flex flex-col gap-4">
							<h3 className="text-base font-semibold text-[#334155] leading-7 m-0">
								{__('Header Image', 'quillforms')}
							</h3>

							{ /* Dropzone */}
							<MediaUpload
								onSelect={(media) =>
									setSettingField('emails_header_image', media.url)
								}
								allowedTypes={['image']}
								render={({ open }) =>
									isEmpty(settings.emails_header_image) ? (
										<button
											onClick={open}
											className="w-full  border-2 border-dashed border-[#B2328C] rounded-xl py-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-[#fff] hover:border-[#B2328C] hover:bg-pink-50 transition-colors"
										>
											<UploadIcon />
											<span className="text-xs text-gray-500">
												{__('Click to upload an image or', 'quillforms')}
											</span>
											<span className="text-xs font-semibold text-[#B2328C]">
												{__('Drag & Drop', 'quillforms')}
											</span>
										</button>
									) : (
										<div className="flex items-center justify-between gap-3 border-2 border-dashed border-[#B2328C] rounded-xl p-4 bg-white">
											<div className="flex items-center gap-3 flex-1 min-w-0">
												<img
													src={settings.emails_header_image}
													alt="Header"
													className="w-[90px] h-[90px] object-cover rounded-lg flex-shrink-0"
												/>
												<span className="text-sm text-gray-700 truncate">
													{settings.emails_header_image.split('/').pop() || settings.emails_header_image}
												</span>
											</div>
											<div className="flex items-center gap-2 flex-shrink-0">
												<CustomButton
													text={__('Replace Image', 'quillforms')}
													onClick={open}
													variant="outlineSecondary"
													className="!text-base !px-3 !py-2 !rounded-[8px]"
												/>
												<button
													onClick={() => setSettingField('emails_header_image', '')}
													className="w-8 h-8 rounded-[8px] border border-red-300 bg-white text-red-500 hover:bg-red-50 transition-colors cursor-pointer flex items-center justify-center p-0"
													aria-label={__('Remove image', 'quillforms')}
												>
													<TrashIcon width={24} height={24} />
												</button>
											</div>
										</div>
									)
								}
							/>

							{ /* Hint */}
							<div className="flex items-start gap-2">
								<WarningIcon width={32} height={32} />
								<p className="text-base text-[#CB5301] m-0 leading-7 font-medium">
									{__('Upload or choose a logo to be displayed at the top of email notifications. Recommended size is 300x100 or smaller for best support on all devices.', 'quillforms')}
								</p>
							</div>
						</div>

						{ /* Background Color card */}
						<div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 flex flex-col gap-4">
							<h3 className="text-base font-semibold text-[#334155] leading-7 m-0">
								{__('Background Color', 'quillforms')}
							</h3>

							<CustomColorPalette
								value={settings.emails_background_color}
								onChange={(val) => setSettingField('emails_background_color', val)}
							/>

							{ /* Hint */}
							<div className="flex items-start gap-2">
								<WarningIcon width={32} height={32} />
								<p className="text-base text-[#CB5301] m-0 leading-7 font-medium">
									{__('Customize the background color of the HTML email template.', 'quillforms')}
								</p>
							</div>
						</div>
					</div>

					{ /* Save Changes — fixed bottom-right bar */}
					<div className="absolute bottom-0 left-0 right-0 bg-white px-6 py-4 rounded-b-[20px] shadow-[0_-2px_8px_rgba(0,0,0,0.05)] z-10 flex justify-end">
						<CustomButton
							text={isSaving
								? __('Saving…', 'quillforms')
								: __('Save Changes', 'quillforms')}
							onClick={save}
							variant="primary"
							disabled={isSaving}
							className={isEmpty(settings?.emails_header_image)
								? '!bg-[#777] !border-[#777]'
								: '!bg-[#B2328C] !border-[#B2328C]'}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default Emails;
