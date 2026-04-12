import CodeIcon from "./code-icon";
import LinkIcon from "./link-icon";
import PopupIcon from "./popup-icon";
import { useEffect, useState, useRef } from "react";
import { useSelect } from "@wordpress/data";
import { Modal } from "@wordpress/components";
import { ComboColorPicker, ColorPicker } from "@quillforms/theme-editor";
import { Button } from "@quillforms/admin-components";
import { css } from "emotion";
import QRCode from "react-qr-code";
import QRCodeIcon from "./qrcode-icon";
import { __ } from "@wordpress/i18n";
import apiFetch from "@wordpress/api-fetch";

import configApi from "@quillforms/config";
import { size } from "lodash";
import ShareIcon from "../../components/icon/share-icon";
import Share from "../../../assets/images/share.png";
import Shortcode from "../../../assets/images/shortcode.png";
import EmdedCode from "../../../assets/images/embedcode.png";
import QrCodeImg from "../../../assets/images/qrcode.png";
import PopupImg from "../../../assets/images/popup.png";

// Shared palette colors (same as Emails settings panels)
const BUTTON_PALETTE_COLORS = [
	'#fce7f3', '#ef4444', '#f97316', '#f59e0b',
	'#34d399', '#14b8a6', '#7dd3fc', '#3b82f6',
	'#8b5cf6', '#a855f7', '#d1d5db', '#1e293b',
];

const ButtonColorPalette = ({ value, onChange, defaultColor }) => {
	const inputRef = useRef(null);

	return (
		<div className="quillforms-share-popup-color-palette">
			<div className="quillforms-share-popup-color-palette__row">
				<button
					type="button"
					onClick={() => inputRef.current?.click()}
					className="quillforms-share-popup-color-palette__add"
				>
					+
					<input
						ref={inputRef}
						type="color"
						value={value || defaultColor}
						onChange={(e) => onChange(e.target.value)}
						className="quillforms-share-popup-color-palette__native-input"
					/>
				</button>
				{BUTTON_PALETTE_COLORS.map((color) => (
					<button
						type="button"
						key={color}
						onClick={() => onChange(color)}
						style={{ backgroundColor: color }}
						className={[
							'quillforms-share-popup-color-palette__swatch',
							value === color ? 'quillforms-share-popup-color-palette__swatch--active' : '',
						].join(' ')}
						aria-label={color}
					/>
				))}
			</div>
			<button
				type="button"
				onClick={() => onChange(defaultColor)}
				className="quillforms-share-popup-color-palette__clear"
			>
				{__('Clear', 'quillforms')}
			</button>
		</div>
	);
};

// Alias specifically for button background color (same UI as ButtonColorPalette)
const ButtonBgGroundColor = (props) => <ButtonColorPalette {...props} />;

const hiddenFieldsContainer = css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    margin: 20px 0;
`;

const hiddenFieldRow = css`
    display: flex;
    flex-direction: column;
    gap: 8px;

    label {
        font-size: 14px;
        font-weight: 500;
        color: #374151;
        margin-bottom: 4px;
    }

    input {
        width: 100%;
        padding: 10px 14px;
        border: 1px solid #E5E7EB;
        border-radius: 6px;
        font-size: 14px;
        line-height: 20px;
        color: #1F2937;
        background-color: #FFFFFF;
        transition: all 0.2s ease;

        &::placeholder {
            color: #9CA3AF;
        }

        &:hover {
            border-color: #D1D5DB;
        }

        &:focus {
            outline: none;
            border-color: #2563EB;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        /* Prevent gray background on autofill */
        &:-webkit-autofill,
        &:-webkit-autofill:hover,
        &:-webkit-autofill:focus,
        &:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px white inset !important;
            box-shadow: 0 0 0 30px white inset !important;
            -webkit-text-fill-color: #1F2937 !important;
            transition: background-color 5000s ease-in-out 0s;
        }
    }
`;

const routingTypeSelect = css`
    margin-top: 20px;

    label {
        display: block;
        font-size: 14px;
        font-weight: 500;
        color: #374151;
        margin-bottom: 8px;
    }

    select {
        width: 100%;
        padding: 10px 14px;
        border: 1px solid #E5E7EB;
        border-radius: 6px;
        font-size: 14px;
        line-height: 20px;
        color: #1F2937;
        background-color: #FFFFFF;
        cursor: pointer;
        transition: all 0.2s ease;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
        padding-right: 40px;

        &:hover {
            border-color: #D1D5DB;
        }

        &:focus {
            outline: none;
            border-color: #2563EB;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
    }
`;

const generatedLinkContainer = css`
    margin-top: 24px;

    h4 {
        font-size: 16px;
        font-weight: 500;
        color: #374151;
        margin: 0 0 12px 0;
    }
`;

const linkRow = css`
    display: flex;
    gap: 12px;
    align-items: center;

    input {
        flex: 1;
        padding: 10px 14px;
        border: 1px solid #E5E7EB;
        border-radius: 6px;
        font-size: 14px;
        line-height: 20px;
        color: #1F2937;
        background-color: #FFFFFF;
        min-width: 400px;
        cursor: text;

        &:focus {
            outline: none;
            border-color: #2563EB;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
    }

    button {
        min-width: 80px;
        transition: all 0.2s ease;

        &:hover {
            transform: translateY(-1px);
        }

        &:active {
            transform: translateY(0);
        }
    }
`;

const ShareBody = ({ payload }) => {



	const isWPEnv = configApi.isWPEnv();

	const [modalState, setModalState] = useState(false);
	const [isCopied, setIsCopied] = useState(false);

	const defaultPopupButtonSettings = {
		buttonTitle: 'Open Form',
		buttonBackgroundColor: '#B2328C',
		buttonTextColor: '#ffffff',
		buttonBorderRadius: '24',
		buttonBorderWidth: '0',
		buttonBorderColor: '#000000',
		buttonFontSize: '16',
		buttonPadding: { top: 12, right: 24, bottom: 12, left: 24 },
	};

	const [popupSettings, setPopupSettings] = useState({
		...defaultPopupButtonSettings,
		popupMaxWidth: '90',
		popupMaxWidthUnit: '%',
		popupMaxHeight: '90',
		popupMaxHeightUnit: '%',
	});

	const [popupSettingsModalOpen, setPopupSettingsModalOpen] = useState(false);
	const [draftButtonSettings, setDraftButtonSettings] = useState({ ...defaultPopupButtonSettings });

	const isButtonCustomized = JSON.stringify({
		buttonTitle: popupSettings.buttonTitle,
		buttonBackgroundColor: popupSettings.buttonBackgroundColor,
		buttonTextColor: popupSettings.buttonTextColor,
		buttonBorderRadius: popupSettings.buttonBorderRadius,
		buttonBorderWidth: popupSettings.buttonBorderWidth,
		buttonBorderColor: popupSettings.buttonBorderColor,
		buttonFontSize: popupSettings.buttonFontSize,
		buttonPadding: popupSettings.buttonPadding,
	}) !== JSON.stringify(defaultPopupButtonSettings);

	const openButtonSettings = () => {
		setDraftButtonSettings({
			buttonTitle: popupSettings.buttonTitle,
			buttonBackgroundColor: popupSettings.buttonBackgroundColor,
			buttonTextColor: popupSettings.buttonTextColor,
			buttonBorderRadius: popupSettings.buttonBorderRadius,
			buttonBorderWidth: popupSettings.buttonBorderWidth,
			buttonBorderColor: popupSettings.buttonBorderColor,
			buttonFontSize: popupSettings.buttonFontSize,
			buttonPadding: { ...popupSettings.buttonPadding },
		});
		setPopupSettingsModalOpen(true);
	};

	const saveButtonSettings = () => {
		setPopupSettings(prev => ({ ...prev, ...draftButtonSettings }));
		setPopupSettingsModalOpen(false);
	};

	const resetButtonSettings = () => {
		setPopupSettings(prev => ({ ...prev, ...defaultPopupButtonSettings }));
	};

	const copyToClipboard = async (text) => {
		try {
			// Try modern clipboard API first
			if (navigator.clipboard && window.isSecureContext) {
				await navigator.clipboard.writeText(text);
				setIsCopied(true);
				return;
			}

			// Fallback for older browsers or non-HTTPS
			const textArea = document.createElement('textarea');
			textArea.value = text;
			textArea.style.position = 'fixed';
			textArea.style.left = '-999999px';
			textArea.style.top = '-999999px';
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();

			const successful = document.execCommand('copy');
			document.body.removeChild(textArea);

			if (successful) {
				setIsCopied(true);
			} else {
				console.error('Copy failed');
				// Optionally show an error message to user
			}
		} catch (err) {
			console.error('Copy failed:', err);
			// Fallback: create a temporary input for manual copy
			const input = document.createElement('input');
			input.value = text;
			input.style.position = 'fixed';
			input.style.opacity = '0';
			document.body.appendChild(input);
			input.select();
			input.setSelectionRange(0, 99999); // For mobile devices

			// Show a message to manually copy
			alert('Please manually copy the text: Ctrl+C (Cmd+C on Mac)');

			setTimeout(() => {
				document.body.removeChild(input);
			}, 100);
		}
	};
	// Add this shortcodeSettings state
	const [shortcodeSettings, setShortcodeSettings] = useState({
		width: { value: 100, unit: '%' },
		minHeight: { value: 500, unit: 'px' },
		maxHeight: { value: 0, unit: 'auto' }
	});

	const [fieldValues, setFieldValues] = useState({});
	const [routingType, setRoutingType] = useState('query');

	const generateURL = () => {
		const baseURL = getLinkWithSlug().replace(/\/+$/, '');
		const filledFields = Object.entries(fieldValues)
			.filter(([_, value]) => value)
			.map(([name, value]) => `${name}=${encodeURIComponent(value)}`)
			.join('&');

		if (!filledFields) return baseURL;

		if (routingType === 'query') {
			return `${baseURL}${baseURL.includes('?') ? '&' : '?'}${filledFields}`;
		} else {
			return `${baseURL}#${filledFields}`;
		}
	};


	const generateShortcode = () => {
		const width = `${shortcodeSettings.width.value}${shortcodeSettings.width.unit}`;
		const minHeight = `${shortcodeSettings.minHeight.value}${shortcodeSettings.minHeight.unit}`;
		const maxHeight = shortcodeSettings.maxHeight.unit === 'auto'
			? 'auto'
			: `${shortcodeSettings.maxHeight.value}${shortcodeSettings.maxHeight.unit}`;

		return `[quillforms id="${payload?.id}" width="${width}" min_height="${minHeight}" max_height="${maxHeight}"]`;
	};


	const downloadQR = () => {
		const svg = document.querySelector(".quillforms-qr-share-modal svg");
		const svgData = new XMLSerializer().serializeToString(svg);
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const img = new Image();
		img.onload = function () {
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);
			const pngFile = canvas.toDataURL("image/png");

			const downloadLink = document.createElement("a");
			downloadLink.download = "quillforms-qrcode";
			downloadLink.href = `${pngFile}`;
			downloadLink.click();
		};

		img.src = "data:image/svg+xml;base64," + btoa(svgData);
	};

	// Map React state keys to the attribute names expected by the PHP shortcode handler.
	// The backend uses all‑lowercase, no‑camelcase keys (e.g. `popupmaxwidth`, `buttontitle`).
	const popupShortcodeAttrMap = {
		buttonTitle: 'buttontitle',
		buttonBackgroundColor: 'buttonbackgroundcolor',
		buttonTextColor: 'buttontextcolor',
		buttonBorderRadius: 'buttonborderradius',
		buttonBorderWidth: 'buttonborderwidth',
		buttonBorderColor: 'buttonbordercolor',
		buttonFontSize: 'buttonfontsize',
		buttonPadding: 'buttonpadding',
		popupMaxWidth: 'popupmaxwidth',
		popupMaxWidthUnit: 'popupmaxwidthunit',
		popupMaxHeight: 'popupmaxheight',
		popupMaxHeightUnit: 'popupmaxheightunit',
	};

	const popupShortcode = `[quillforms-popup id="${payload?.id}" ${Object.keys(popupSettings)
		.map(($key) => {
			const mappedKey = popupShortcodeAttrMap[$key] || $key.toLowerCase();

			if ($key === 'buttonPadding') {
				// Convert padding object to CSS shorthand with px units: "12px 24px 12px 24px"
				const paddingValue = Object.keys(popupSettings[$key])
					.map(($paddingKey) => `${popupSettings[$key][$paddingKey]}px`)
					.join(' ');

				return `${mappedKey}="${paddingValue}"`;
			}

			return `${mappedKey}="${popupSettings[$key]}"`;
		})
		.join(' ')} ]`;


	useEffect(() => {
		if (isCopied) {
			setTimeout(() => {
				setIsCopied(false);
			}, 4000);
		}
	}, [isCopied]);

	const extractSlug = (link) => {
		const url = (link || '').replace(/\/+$/, '');
		return url.split('/').pop() || '';
	};

	const currentSlug = extractSlug(payload?.link);
	const [slug, setSlug] = useState('');
	const [savedSlug, setSavedSlug] = useState(currentSlug);
	const [isSavingSlug, setIsSavingSlug] = useState(false);
	const [slugSaveStatus, setSlugSaveStatus] = useState(null); // 'saved' | 'error' | null

	const saveSlug = async () => {
		const trimmed = (slug || currentSlug).trim();
		if (!trimmed || trimmed === savedSlug) return;
		setIsSavingSlug(true);
		setSlugSaveStatus(null);
		try {
			await apiFetch({
				path: `/wp/v2/quill_forms/${payload.id}`,
				method: 'POST',
				data: { slug: trimmed },
			});
			setSavedSlug(trimmed);
			setSlugSaveStatus('saved');
		} catch (err) {
			console.error('Failed to save slug:', err);
			setSlugSaveStatus('error');
		} finally {
			setIsSavingSlug(false);
			setTimeout(() => setSlugSaveStatus(null), 3000);
		}
	};

	const getLinkWithSlug = () => {
		const link = (payload?.link || '').replace(/\/+$/, '');
		const parts = link.split('/');
		parts[parts.length - 1] = savedSlug;
		return parts.join('/') + '/';
	};

	const hiddenFields = payload.hidden_fields;
	const [openSection, setOpenSection] = useState('link');
	const [previewDevice, setPreviewDevice] = useState('desktop');

	const toggleSection = (key) => setOpenSection(openSection === key ? null : key);

	const chevronIcon = (isOpen) => (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
			style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
			<polyline points="6 9 12 15 18 9" />
		</svg>
	);

	const previewWidths = { desktop: '100%', tablet: '768px', mobile: '375px' };

	return (
		<div className="quillforms-share-layout">

			{/* ── Left panel: accordion ── */}
			<div className="quillforms-share-left">

				{/* Header */}
				<div className="quillforms-share-left__header">
					<ShareIcon />
					<p className="quillforms-share-left__title">
						{__('Share Your Form with Others using Multiple Options', 'quillforms')}
					</p>
				</div>

				{/* Accordion items */}
				<div className="quillforms-share-accordion">

				{/* Slug card */}
					<div className="quillforms-share-accordion__item quillforms-share-accordion__item--open">
						<div className="quillforms-share-accordion__toggle" style={{ cursor: 'default' }}>
							<span className="quillforms-share-accordion__toggle-label">
								{__('Slug', 'quillforms')}
							</span>
						</div>
						<div className="quillforms-share-accordion__content">
							<div className="quillforms-share-slug-row">
								<input
									type="text"
									value={slug}
									onChange={(e) => setSlug(e.target.value)}
									onKeyDown={(e) => e.key === 'Enter' && saveSlug()}
									placeholder={__('Slug', 'quillforms')}
									className="quillforms-share-slug-field-input"
								/>
								<button
									onClick={saveSlug}
									disabled={isSavingSlug || !slug.trim() || slug.trim() === savedSlug || slug.trim() === currentSlug}
									className="quillforms-share-slug-save-btn"
								>
									{isSavingSlug
										? __('Saving…', 'quillforms')
										: slugSaveStatus === 'saved'
											? __('Saved!', 'quillforms')
											: slugSaveStatus === 'error'
												? __('Error', 'quillforms')
												: __('Save', 'quillforms')}
								</button>
							</div>
						</div>
					</div>

					{/* Direct Link */}
					<div className={`quillforms-share-accordion__item${openSection === 'link' ? ' quillforms-share-accordion__item--open' : ''}`}>
						<button onClick={() => toggleSection('link')} className="quillforms-share-accordion__toggle">
							<span className="quillforms-share-accordion__toggle-label">
								{__('Direct Link', 'quillforms')}
							</span>
							{chevronIcon(openSection === 'link')}
						</button>
						{openSection === 'link' && (
							<div className="quillforms-share-accordion__content">
								<div className="quillforms-share-info-banner">
									<div className="quillforms-share-info-banner__icon">
										<img src={Share} alt="Link Icon" />
									</div>
									<p className="quillforms-share-info-banner__title">{__('Generate & Share a Direct Link', 'quillforms')}</p>
									<p className="quillforms-share-info-banner__desc">{__('Copy the link, customize the slug, and share it wherever your audience is — fast, simple, and flexible.', 'quillforms')}</p>

								</div>
								<label className="quillforms-share-field-label">{__('Generated URL', 'quillforms')}</label>
								<div className="quillforms-share-field-row">
									<input type="text" value={generateURL()} readOnly className="quillforms-share-field-input" />
									<button onClick={() => { copyToClipboard(generateURL()); setIsCopied(true); }} className="quillforms-share-copy-btn">
										<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
										{isCopied ? __('Copied!', 'quillforms') : __('Copy', 'quillforms')}
									</button>
								</div>
							{size(hiddenFields) > 0 && (
									<div className="quillforms-share-hidden-fields">
										<p className="quillforms-share-hidden-fields__title">{__('Hidden Fields', 'quillforms')}</p>
										{hiddenFields.map((field) => field.name.trim() ? (
											<div key={field.name} className="quillforms-share-hidden-field-row">
												<label>{field.name}</label>
												<input type="text" value={fieldValues[field.name] || ''} placeholder={__('Enter value', 'quillforms')}
													onChange={(e) => setFieldValues(prev => ({ ...prev, [field.name]: e.target.value }))}
												/>
											</div>
										) : null)}
									</div>
								)}
							</div>
						)}
					</div>

					{/* Shortcode */}
					{isWPEnv && (
						<div className={`quillforms-share-accordion__item${openSection === 'shortcode' ? ' quillforms-share-accordion__item--open' : ''}`}>
							<button onClick={() => toggleSection('shortcode')} className="quillforms-share-accordion__toggle">
								<span className="quillforms-share-accordion__toggle-label">

									{__('Shortcode', 'quillforms')}
								</span>
								{chevronIcon(openSection === 'shortcode')}
							</button>
							{openSection === 'shortcode' && (
								<div className="quillforms-share-accordion__content">
									{/* Info banner */}
									<div className="quillforms-share-info-banner">
										<div className="quillforms-share-info-banner__icon">
											<img src={Shortcode} alt="Shortcode Icon" />
										</div>
										<p className="quillforms-share-info-banner__title">{__('Embed your form anywhere with a Shortcode', 'quillforms')}</p>
										<p className="quillforms-share-info-banner__desc">{__("Configure your form's dimensions, copy the shortcode, It's flexible, responsive, and built to fit your content.", 'quillforms')}</p>
									</div>

									{/* Settings rows */}
									{[
										{ label: __('Width', 'quillforms'), key: 'width', units: ['%', 'px', 'vw'] },
										{ label: __('Minimum Height', 'quillforms'), key: 'minHeight', units: ['px', 'vh'] },
										{ label: __('Maximum Height', 'quillforms'), key: 'maxHeight', units: ['px', 'vh', 'auto'] },
									].map(({ label, key, units }) => (
										<div key={key} className="quillforms-share-dimension-row">
											<label className="quillforms-share-field-label">{label}</label>
											<div className="quillforms-share-dimension-inputs">
												<input
													type="number"
													value={shortcodeSettings[key].value}
													onChange={(e) => setShortcodeSettings(prev => ({ ...prev, [key]: { ...prev[key], value: e.target.value } }))}
													className="quillforms-share-dimension-input"
												/>
												<select
													value={shortcodeSettings[key].unit}
													onChange={(e) => setShortcodeSettings(prev => ({ ...prev, [key]: { ...prev[key], unit: e.target.value } }))}
													className="quillforms-share-dimension-select"
												>
													{units.map(u => <option key={u} value={u}>{u}</option>)}
												</select>
											</div>
										</div>
									))}

									{/* Generated shortcode */}
									<label className="quillforms-share-field-label">{__('Generated Shortcode', 'quillforms')}</label>
									<div className="quillforms-share-field-row-mono">
										<input type="text" value={generateShortcode()} readOnly className="quillforms-share-field-input--mono" />
										<button onClick={() => { copyToClipboard(generateShortcode()); setIsCopied(true); }} className="quillforms-share-copy-btn">
											<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
											{isCopied ? __('Copied!', 'quillforms') : __('Copy', 'quillforms')}
										</button>
									</div>
								</div>
							)}
						</div>
					)}

					{/* Embed Code */}
					<div className={`quillforms-share-accordion__item${openSection === 'embed' ? ' quillforms-share-accordion__item--open' : ''}`}>
						<button onClick={() => toggleSection('embed')} className="quillforms-share-accordion__toggle">
							<span className="quillforms-share-accordion__toggle-label">
								{__('Embed Code', 'quillforms')}
							</span>
							{chevronIcon(openSection === 'embed')}
						</button>
						{openSection === 'embed' && (
							<div className="quillforms-share-accordion__content">
								{/* For WordPress environment: match design with banner + URL row */}
								{isWPEnv ? (
									<>
										<div className="quillforms-share-info-banner">
											<div className="quillforms-share-info-banner__icon">
												{/* Re‑use shortcode image as embed icon */}
												<img src={EmdedCode} alt={__('Embed Icon', 'quillforms')} />
											</div>
											<p className="quillforms-share-info-banner__title">
												{__('Embed your form right into your page', 'quillforms')}
											</p>
											<p className="quillforms-share-info-banner__desc">
												{__('Copy the code and drop it into any page — no setup needed.', 'quillforms')}
											</p>
										</div>

										<label className="quillforms-share-field-label">
											{__('Generated URL', 'quillforms')}
										</label>
										<div className="quillforms-share-field-row-mono">
											<input
												type="text"
												readOnly
												value={`<iframe src="${payload.link}" width="100%" height="600" style="border:0;"></iframe>`}
												className="quillforms-share-field-input--mono"
											/>
											<button
												onClick={() => {
													copyToClipboard(
														`<iframe src="${payload.link}" width="100%" height="600" style="border:0;"></iframe>`
													);
													setIsCopied(true);
												}}
												className="quillforms-share-copy-btn"
											>
												<svg
													width="15"
													height="15"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<rect x="9" y="9" width="13" height="13" rx="2" />
													<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
												</svg>
												{isCopied ? __('Copied!', 'quillforms') : __('Copy', 'quillforms')}
											</button>
										</div>
									</>
								) : (
									<>
										<p className="quillforms-share-accordion__desc">
											{__('Copy the embed code below and insert it in your external page.', 'quillforms')}
										</p>
										<textarea
											readOnly
											rows={5}
											value={
												`<!-- QuillForms Embed Script -->\n<script src="https://quillforms.app/embed/quillforms-embed.js"></script>\n\n` +
												`<iframe src="${payload.link}" width="100%" height="600" style="border:0;"></iframe>`
											}
											className="quillforms-share-field-textarea"
										/>
										<button
											onClick={() => {
												const code =
													`<!-- QuillForms Embed Script -->\n<script src="https://quillforms.app/embed/quillforms-embed.js"></script>\n\n` +
													`<iframe src="${payload.link}" width="100%" height="600" style="border:0;"></iframe>`;
												copyToClipboard(code);
												setIsCopied(true);
											}}
											className="quillforms-share-copy-btn--full"
										>
											{isCopied ? __('Copied!', 'quillforms') : __('Copy Code', 'quillforms')}
										</button>
									</>
								)}
							</div>
						)}
					</div>

					{/* Popup */}
					{isWPEnv && (
						<div className={`quillforms-share-accordion__item${openSection === 'popup' ? ' quillforms-share-accordion__item--open' : ''}`}>
							<button onClick={() => toggleSection('popup')} className="quillforms-share-accordion__toggle">
								<span className="quillforms-share-accordion__toggle-label">
									{__('Popup', 'quillforms')}
								</span>
								{chevronIcon(openSection === 'popup')}
							</button>
							{openSection === 'popup' && (
								<div className="quillforms-share-accordion__content">

									{/* Info banner */}
									<div className="quillforms-share-info-banner">
										<div className="quillforms-share-info-banner__icon">
											<img src={PopupImg} alt={__('Popup Icon', 'quillforms')} />
										</div>
										<p className="quillforms-share-info-banner__title">{__('Popup Form Made Simple', 'quillforms')}</p>
										<p className="quillforms-share-info-banner__desc">{__('Customize the button & let your form pop up when users need it.', 'quillforms')}</p>
									</div>

									{/* Button preview card */}
									<div className="quillforms-share-popup-preview-card">
										<div className="quillforms-share-popup-preview-card__header">
											<span className="quillforms-share-popup-preview-card__label">{__('Preview', 'quillforms')}</span>
										</div>
										<div className="quillforms-share-popup-preview-card__body">
											<button
												className="quillforms-share-popup-btn-preview"
												style={{
													background: popupSettings.buttonBackgroundColor,
													color: popupSettings.buttonTextColor,
													borderRadius: `${popupSettings.buttonBorderRadius}px`,
													border: `${popupSettings.buttonBorderWidth}px solid ${popupSettings.buttonBorderColor}`,
													fontSize: `${popupSettings.buttonFontSize}px`,
													padding: `${popupSettings.buttonPadding.top}px ${popupSettings.buttonPadding.right}px ${popupSettings.buttonPadding.bottom}px ${popupSettings.buttonPadding.left}px`,
												}}
											>
												{popupSettings.buttonTitle}
											</button>
										</div>
										<div className=" h-[1px] bg-[#D9D9D9] w-full my-4"></div>
										{/* Button settings row */}
										<div className="quillforms-share-popup-settings-bar">
											<span className="quillforms-share-popup-settings-bar__label">{__('Button Settings', 'quillforms')}</span>
											<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
												{isButtonCustomized && (
													<button onClick={resetButtonSettings} className="quillforms-share-popup-settings-bar__btn quillforms-share-popup-settings-bar__btn--reset">
														{__('Reset', 'quillforms')}
													</button>
												)}
												<button onClick={openButtonSettings} className="quillforms-share-popup-settings-bar__btn">
													{isButtonCustomized ? __('Edit Button', 'quillforms') : __('Customize Button', 'quillforms')}
												</button>
											</div>
										</div>
									</div>



									{/* Popup max height */}
									<div className="quillforms-share-dimension-row">
										<label className="quillforms-share-field-label">{__('Popup max height', 'quillforms')}</label>
										<div className="quillforms-share-dimension-inputs">
											<input type="number" value={popupSettings.popupMaxHeight}
												onChange={(e) => setPopupSettings(prev => ({ ...prev, popupMaxHeight: e.target.value }))}
												className="quillforms-share-dimension-input"
											/>
											<select value={popupSettings.popupMaxHeightUnit}
												onChange={(e) => setPopupSettings(prev => ({ ...prev, popupMaxHeightUnit: e.target.value }))}
												className="quillforms-share-dimension-select"
											>
												<option value="px">PX</option>
												<option value="%">%</option>
												<option value="vh">VH</option>
											</select>
										</div>
									</div>

									{/* Popup max width */}
									<div className="quillforms-share-dimension-row">
										<label className="quillforms-share-field-label">{__('Popup max width', 'quillforms')}</label>
										<div className="quillforms-share-dimension-inputs">
											<input type="number" value={popupSettings.popupMaxWidth}
												onChange={(e) => setPopupSettings(prev => ({ ...prev, popupMaxWidth: e.target.value }))}
												className="quillforms-share-dimension-input"
											/>
											<select value={popupSettings.popupMaxWidthUnit}
												onChange={(e) => setPopupSettings(prev => ({ ...prev, popupMaxWidthUnit: e.target.value }))}
												className="quillforms-share-dimension-select"
											>
												<option value="px">PX</option>
												<option value="%">%</option>
												<option value="vw">VW</option>
											</select>
										</div>
									</div>

									<div className=" h-[1px] bg-[#D9D9D9] w-full my-4"></div>

									{/* Generated shortcode */}
									<p className="quillforms-share-popup-shortcode-desc">
										{__('Copy the shortcode below and insert it in your WordPress page or post.', 'quillforms')}
									</p>
									<div className="quillforms-share-popup-shortcode-card">
										<p className="quillforms-share-field-textarea !p-0 !m-0 quillforms-share-popup-shortcode-card__textarea">
											{popupShortcode}
										</p>
										<div className="quillforms-share-popup-shortcode-card__footer">
											<button
												onClick={() => { copyToClipboard(popupShortcode); setIsCopied(true); }}
												className="quillforms-share-copy-btn"
											>
												<svg
													width="15"
													height="15"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<rect x="9" y="9" width="13" height="13" rx="2" />
													<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
												</svg>
												{isCopied ? __('Copied!', 'quillforms') : __('Copy', 'quillforms')}
											</button>
										</div>
									</div>

									{/* Button Settings Modal */}
									{popupSettingsModalOpen && (
										<Modal
											title={__('Button Settings', 'quillforms')}
											onRequestClose={() => setPopupSettingsModalOpen(false)}
											className="quillforms-share-popup-modal"
										>
											<div className="quillforms-share-popup-modal__body mt-10">
												<div className="quillforms-share-popup-modal__left">

													{/* Button title */}
													<div className="quillforms-share-popup-modal__field">
														<span className="quillforms-share-popup-modal__label">{__('Button title', 'quillforms')}</span>
														<input type="text" value={draftButtonSettings.buttonTitle}
															onChange={(e) => setDraftButtonSettings(prev => ({ ...prev, buttonTitle: e.target.value }))}
															className="quillforms-share-popup-modal__input"
														/>
													</div>

													{/* Border radius + border width */}
													<div className="quillforms-share-popup-modal__row2">
														<div className="quillforms-share-popup-modal__field">
															<span className="quillforms-share-popup-modal__label">{__('Border Radius', 'quillforms')}</span>
															<input type="number" value={draftButtonSettings.buttonBorderRadius}
																onChange={(e) => setDraftButtonSettings(prev => ({ ...prev, buttonBorderRadius: e.target.value }))}
																className="quillforms-share-popup-modal__input"
															/>
														</div>
														<div className="quillforms-share-popup-modal__field">
															<span className="quillforms-share-popup-modal__label">{__('Border Width', 'quillforms')}</span>
															<input type="number" value={draftButtonSettings.buttonBorderWidth}
																onChange={(e) => setDraftButtonSettings(prev => ({ ...prev, buttonBorderWidth: e.target.value }))}
																className="quillforms-share-popup-modal__input"
															/>
														</div>
													</div>

													{/* Button bg color */}
													<div className="quillforms-share-popup-modal__field">
														<span className="quillforms-share-popup-modal__label">{__('Button bg color', 'quillforms')}</span>
														<ButtonBgGroundColor
															value={draftButtonSettings.buttonBackgroundColor}
															defaultColor="#B2328C"
															onChange={(val) =>
																setDraftButtonSettings((prev) => ({
																	...prev,
																	buttonBackgroundColor: val,
																}))
															}
														/>
													</div>

													{/* Button text color */}
													<div className="quillforms-share-popup-modal__field">
														<span className="quillforms-share-popup-modal__label">{__('Button text color', 'quillforms')}</span>
														<ButtonColorPalette
															value={draftButtonSettings.buttonTextColor}
															defaultColor="#ffffff"
															onChange={(val) =>
																setDraftButtonSettings((prev) => ({
																	...prev,
																	buttonTextColor: val,
																}))
															}
														/>
													</div>

													{/* Button border color */}
													<div className="quillforms-share-popup-modal__field">
														<span className="quillforms-share-popup-modal__label">{__('Button border color', 'quillforms')}</span>
														<ButtonColorPalette
															value={draftButtonSettings.buttonBorderColor}
															defaultColor="#000000"
															onChange={(val) =>
																setDraftButtonSettings((prev) => ({
																	...prev,
																	buttonBorderColor: val,
																}))
															}
														/>
													</div>

													{/* Font size */}
													<div className="quillforms-share-popup-modal__field">
														<span className="quillforms-share-popup-modal__label">{__('Button font size(px)', 'quillforms')}</span>
														<input type="number" value={draftButtonSettings.buttonFontSize}
															onChange={(e) => setDraftButtonSettings(prev => ({ ...prev, buttonFontSize: e.target.value }))}
															className="quillforms-share-popup-modal__input"
														/>
													</div>

													{/* Padding */}
													<div className="quillforms-share-popup-modal__field">
														<span className="quillforms-share-popup-modal__label">{__('Button Padding', 'quillforms')}</span>
														{/* Visual padding widget */}
														<div className="quillforms-share-popup-modal__padding-visual">
															{/* Top value */}
															<div className="quillforms-share-popup-modal__padding-row padding-row--top">
																<span className="quillforms-share-popup-modal__pad-val">{draftButtonSettings.buttonPadding.top}</span>
															</div>
															{/* Center row: left value – button – right value */}
															<div className="quillforms-share-popup-modal__padding-row padding-row--center">
																<span className="quillforms-share-popup-modal__pad-val">{draftButtonSettings.buttonPadding.left}</span>
																<div className="quillforms-share-popup-modal__pad-btn-wrap">
																	<button
																		className="quillforms-share-popup-btn-preview quillforms-share-popup-modal__pad-btn"
																		style={{
																			background: draftButtonSettings.buttonBackgroundColor,
																			color: draftButtonSettings.buttonTextColor,
																			borderRadius: `${draftButtonSettings.buttonBorderRadius}px`,
																			border: `${draftButtonSettings.buttonBorderWidth}px solid ${draftButtonSettings.buttonBorderColor}`,
																			fontSize: `${draftButtonSettings.buttonFontSize}px`,
																		}}
																	>
																		{draftButtonSettings.buttonTitle || 'Button Text'}
																	</button>
																</div>
																<span className="quillforms-share-popup-modal__pad-val">{draftButtonSettings.buttonPadding.right}</span>
															</div>
															{/* Bottom value */}
															<div className="quillforms-share-popup-modal__padding-row padding-row--bottom">
																<span className="quillforms-share-popup-modal__pad-val">{draftButtonSettings.buttonPadding.bottom}</span>
															</div>
														</div>
														{/* 4-column input grid — label on top, input below */}
														<div className="quillforms-share-popup-modal__padding-inputs">
															{[
																{ key: 'top', label: __('Top', 'quillforms') },
																{ key: 'bottom', label: __('Bottom', 'quillforms') },
																{ key: 'right', label: __('Right', 'quillforms') },
																{ key: 'left', label: __('Left', 'quillforms') },
															].map(({ key, label }) => (
																<div key={key} className="quillforms-share-popup-modal__padding-col">
																	<input
																		type="number"
																		value={draftButtonSettings.buttonPadding[key]}
																		onChange={(e) => setDraftButtonSettings(prev => ({ ...prev, buttonPadding: { ...prev.buttonPadding, [key]: parseInt(e.target.value) || 0 } }))}
																		className="quillforms-share-popup-modal__input"
																	/>
																	<span>{label}</span>
																</div>
															))}
														</div>
													</div>

												</div>

												{/* Right: live preview */}
												<div className="quillforms-share-popup-modal__right">
													<p className="quillforms-share-popup-modal__preview-label">{__('Preview', 'quillforms')}</p>
													<div className="quillforms-share-popup-modal__preview-box">
														<button
															className="quillforms-share-popup-btn-preview"
															style={{
																background: draftButtonSettings.buttonBackgroundColor,
																color: draftButtonSettings.buttonTextColor,
																borderRadius: `${draftButtonSettings.buttonBorderRadius}px`,
																border: `${draftButtonSettings.buttonBorderWidth}px solid ${draftButtonSettings.buttonBorderColor}`,
																fontSize: `${draftButtonSettings.buttonFontSize}px`,
																padding: `${draftButtonSettings.buttonPadding.top}px ${draftButtonSettings.buttonPadding.right}px ${draftButtonSettings.buttonPadding.bottom}px ${draftButtonSettings.buttonPadding.left}px`,
															}}
														>
															{draftButtonSettings.buttonTitle || 'Button Text'}
														</button>
													</div>
												</div>

											</div>

											{/* Footer */}
											<div className="quillforms-share-popup-modal__footer">
												<button onClick={() => setPopupSettingsModalOpen(false)} className="quillforms-share-popup-modal__cancel">
													{__('Cancel', 'quillforms')}
												</button>
												<button onClick={saveButtonSettings} className="quillforms-share-popup-modal__save">
													{__('Save Changes', 'quillforms')}
												</button>
											</div>
										</Modal>
									)}

								</div>
							)}
						</div>
					)}

					{/* QR Code */}
					<div className={`quillforms-share-accordion__item${openSection === 'qr' ? ' quillforms-share-accordion__item--open' : ''}`}>
						<button onClick={() => toggleSection('qr')} className="quillforms-share-accordion__toggle">
							<span className="quillforms-share-accordion__toggle-label">
								{__('QR Code', 'quillforms')}
							</span>
							{chevronIcon(openSection === 'qr')}
						</button>
						{openSection === 'qr' && (
							<div className="quillforms-share-qr-content">
								{/* Top icon + title + description */}
								<div className="quillforms-share-info-banner">
									<div className="quillforms-share-info-banner__icon">
										<img src={QrCodeImg} alt={__('QR Icon', 'quillforms')} />
									</div>
									<p className="quillforms-share-info-banner__title">
										{__('Easy access via QR code', 'quillforms')}
									</p>
									<p className="quillforms-share-info-banner__desc">
										{__(
											'Simply scan the code to initiate your Quill Forms, which function seamlessly both online and offline (printer required naturally).',
											'quillforms'
										)}
									</p>
								</div>

								{/* Warning banner */}
								<div className="quillforms-share-qr-warning">
									<span className="quillforms-share-qr-warning__icon">⚠</span>
									<span className="quillforms-share-qr-warning__text">
										{__(
											'Changing the slug of your form within the builder will result in a corresponding alteration of the QR code.',
											'quillforms'
										)}
									</span>
								</div>

								{/* QR code + download button row */}
								<div className="quillforms-share-qr-row">
									<div className="quillforms-qr-share-modal">
										<QRCode value={payload?.link} size={180} />
									</div>
									<button onClick={() => downloadQR()} className="quillforms-share-qr-download-btn">
										{__('Download QR', 'quillforms')}
									</button>
								</div>
							</div>
						)}
					</div>

				</div>
			</div>

			{/* ── Right panel: form preview ── */}
			<div className="quillforms-share-right">

				{/* Device switcher */}
				<div className="quillforms-share-device-switcher">
					{[
						{ key: 'desktop', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg> },
						{ key: 'tablet', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg> },
						{ key: 'mobile', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg> },
					].map(({ key, icon }) => (
						<button
							key={key}
							onClick={() => setPreviewDevice(key)}
							className={`quillforms-share-device-btn${previewDevice === key ? ' quillforms-share-device-btn--active' : ''}`}
						>
							{icon}
						</button>
					))}
				</div>

				{/* iframe preview — padding & bg are dynamic (device-dependent) */}
				<div
					className="quillforms-share-preview"
					style={{
						padding: previewDevice === 'desktop' ? '0' : '24px',
						background: previewDevice === 'desktop' ? '#fff' : '#F2F4FC',
					}}
				>
					<div
						className="quillforms-share-preview__frame"
						style={{
							width: previewWidths[previewDevice],
							borderRadius: previewDevice === 'desktop' ? '0' : '12px',
							boxShadow: previewDevice === 'desktop' ? 'none' : '0 4px 24px rgba(0,0,0,0.1)',
						}}
					>
						<iframe
							src={payload?.link}
							title={__('Form Preview', 'quillforms')}
							style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
						/>
					</div>
				</div>

			</div>
		</div>
	);

};

export default ShareBody;

