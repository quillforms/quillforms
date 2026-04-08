/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
	Button,
	FontPicker,
	TextControl,
	ResponsiveControl,
} from '@quillforms/admin-components';
import configApi from '@quillforms/config';
import { getDefaultThemeProperties } from '@quillforms/utils';

/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import {
	PanelBody,
	FocalPointPicker,
	CheckboxControl,
	Tooltip,
} from '@wordpress/components';
import { MediaUpload } from '@wordpress/media-utils';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * External Dependencies
 */
import { forEach, isEmpty, size } from 'lodash';
import tinycolor from 'tinycolor2';
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import AlphaColorPicker from '../alpha-color-picker';
import ComboColorPicker from '../combo-color-picker';
import { isGradient } from '../combo-color-picker/utils';
import ColorPreview from '../color-preview';
import CustomizeFooter from '../customize-footer';
import TypographyPanel from '../typography-panel';
import { IconDesktop, IconMobile } from '../typography-panel/icons';
import {
	BgImageReplaceIcon,
	BgImageDeleteIcon,
	BgImageNoteIcon,
} from './bg-image-icons';

/**
 * Red "Clear" styling only when the user has a real overlay tint (not
 * transparent and not the schema default background, which reads as "unset" on load).
 */
function shouldEmphasizeBackgroundOverlayClear(color) {
	const defaultBg = getDefaultThemeProperties().backgroundColor;
	if (color === undefined || color === null) {
		return false;
	}
	if (typeof color !== 'string') {
		return true;
	}
	const trimmed = color.trim();
	if (!trimmed) {
		return false;
	}
	if (isGradient(trimmed)) {
		return true;
	}
	const c = tinycolor(trimmed);
	if (!c.isValid()) {
		return false;
	}
	if (c.getAlpha() <= 0) {
		return false;
	}
	const def = tinycolor(defaultBg);
	if (def.isValid() && c.toRgbString() === def.toRgbString()) {
		return false;
	}
	return true;
}

/** Gray vs red Clear for theme color fields (same rules as overlay, per-schema default). */
function shouldEmphasizeThemeColorClear(color, schemaDefault) {
	if (color === undefined || color === null) {
		return false;
	}
	if (typeof color !== 'string') {
		return true;
	}
	const trimmed = color.trim();
	if (!trimmed) {
		return false;
	}
	if (isGradient(trimmed)) {
		if (typeof schemaDefault !== 'string') {
			return true;
		}
		const defGradient = schemaDefault.trim();
		if (!defGradient || !isGradient(defGradient)) {
			return true;
		}
		return trimmed !== defGradient;
	}
	const c = tinycolor(trimmed);
	if (!c.isValid()) {
		return false;
	}
	if (c.getAlpha() <= 0) {
		return false;
	}
	if (schemaDefault === undefined || schemaDefault === null) {
		return true;
	}
	const def = tinycolor(schemaDefault);
	if (!def.isValid()) {
		return true;
	}
	return c.toRgbString() !== def.toRgbString();
}

function normalizeThemeColor(value, fallback) {
	if (value === undefined || value === null || value === '') {
		return fallback;
	}
	return value;
}

function parseThemePaddingSide(padding, side, bk) {
	const raw = padding?.[side]?.[bk];
	if (raw === undefined || raw === null) {
		return 0;
	}
	const n = parseInt(String(raw).replace(/px/gi, ''), 10);
	return Number.isFinite(n) ? n : 0;
}

function ButtonsPaddingPreview({ padding, bk }) {
	const t = parseThemePaddingSide(padding, 'top', bk);
	const r = parseThemePaddingSide(padding, 'right', bk);
	const b = parseThemePaddingSide(padding, 'bottom', bk);
	const l = parseThemePaddingSide(padding, 'left', bk);
	return (
		<div
			className="theme-editor-customize__buttons-padding-preview"
			aria-hidden="true"
		>
			<div className="theme-editor-customize__buttons-padding-preview__measure theme-editor-customize__buttons-padding-preview__measure--top">
				{t}
			</div>
			<div className="theme-editor-customize__buttons-padding-preview__row">
				<span className="theme-editor-customize__buttons-padding-preview__measure theme-editor-customize__buttons-padding-preview__measure--side">
					{l}
				</span>
				<div className="theme-editor-customize__buttons-padding-preview__fake-btn">
					{__('Button Text', 'quillforms')}
				</div>
				<span className="theme-editor-customize__buttons-padding-preview__measure theme-editor-customize__buttons-padding-preview__measure--side">
					{r}
				</span>
			</div>
			<div className="theme-editor-customize__buttons-padding-preview__measure theme-editor-customize__buttons-padding-preview__measure--bottom">
				{b}
			</div>
		</div>
	);
}

function ThemeSolidColorCard({ color, schemaDefault, onClear, children }) {
	return (
		<div className="theme-editor-customize__overlay-color theme-editor-customize__overlay-color--footer-clear">
			<div className="theme-editor-customize__combo-wrap">{children}</div>
			<div className="theme-editor-customize__subsection-clear-row">
				<button
					type="button"
					className={
						'theme-editor-customize__clear-link theme-editor-customize__clear-link--overlay' +
						(shouldEmphasizeThemeColorClear(color, schemaDefault)
							? ' theme-editor-customize__clear-link--has-value'
							: '')
					}
					onClick={onClear}
				>
					{__('Clear', 'quillforms')}
				</button>
			</div>
		</div>
	);
}

const CustomizeThemePanel = () => {
	const { setCurrentThemeProperties, setCurrentThemeTitle, setCurrentTab } =
		useDispatch('quillForms/theme-editor');
	const { theme, shouldBeSaved, currentThemeId, customFontsList } = useSelect(
		(select) => {
			return {
				shouldBeSaved: select(
					'quillForms/theme-editor'
				).shouldThemeBeSaved(),
				currentThemeId: select(
					'quillForms/theme-editor'
				).getCurrentThemeId(),
				theme: select('quillForms/theme-editor').getCurrentTheme(),
				customFontsList:
					select('quillForms/custom-fonts')?.getFontsList() ?? [],
			};
		}
	);

	let customFonts = {};
	if (size(customFontsList) > 0) {
		forEach(customFontsList, (font) => {
			customFonts[font.title] = 'custom';
		});
	}
	const allFonts = { ...customFonts, ...configApi.getFonts() };
	const { title, properties } = { ...theme };

	const $properties = {
		...getDefaultThemeProperties(),
		...properties,
	};
	const {
		backgroundColor,
		backgroundImage,
		backgroundImageFocalPoint,
		logo,
		font,
		buttonsBorderRadius,
		questionsColor,
		answersColor,
		buttonsBorderWidth,
		buttonsBorderColor,
		buttonsPadding,
		buttonsFontColor,
		questionsLabelFont,
		questionsDescriptionFont,
		applyBaseFontToAll,
		buttonsBgColor,
		formFooterBgColor,
		errorsFontColor,
		errorsBgColor,
		progressBarBgColor,
		progressBarFillColor,
	} = $properties;
	const themeDefaults = getDefaultThemeProperties();
	const [buttonsPaddingViewport, setButtonsPaddingViewport] = useState('lg');
	const paddingBk = buttonsPaddingViewport === 'lg' ? 'lg' : 'sm';
	const [formFooterViewport, setFormFooterViewport] = useState('lg');
	const formFooterBk = formFooterViewport === 'lg' ? 'lg' : 'sm';

	return (
		<div className="theme-editor-customize">
			<div className="theme-editor-customize__header">
				<button
					type="button"
					className="theme-editor-customize__back"
					onClick={() => {
						setCurrentTab('themes-list');
					}}
					aria-label={__('Back to My Themes', 'quillforms')}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						aria-hidden="true"
					>
						<path
							d="M8.98656 11.6687C8.98656 11.7892 9.00581 11.9014 9.04431 12.0052C9.08281 12.109 9.14881 12.2078 9.24231 12.3014L13.7366 16.7957C13.8751 16.934 14.0491 17.0049 14.2588 17.0082C14.4683 17.0114 14.6456 16.9405 14.7906 16.7957C14.9354 16.6507 15.0078 16.475 15.0078 16.2687C15.0078 16.0624 14.9354 15.8867 14.7906 15.7417L10.7173 11.6687L14.7906 7.5957C14.9289 7.4572 14.9997 7.28312 15.0031 7.07345C15.0062 6.86395 14.9354 6.6867 14.7906 6.5417C14.6456 6.39686 14.4699 6.32445 14.2636 6.32445C14.0572 6.32445 13.8816 6.39686 13.7366 6.5417L9.24231 11.0359C9.14881 11.1296 9.08281 11.2284 9.04431 11.3322C9.00581 11.436 8.98656 11.5482 8.98656 11.6687Z"
							fill="#334155"
						/>
					</svg>
				</button>
				<h2 className="theme-editor-customize__header-title">
					{__('Customize', 'quillforms')}
				</h2>
			</div>
			<div className="theme-editor-customize__scroll">
				<div className="theme-editor-customize__theme-title-section">
					<label
						className="theme-editor-customize__theme-title-label"
						htmlFor="quillforms-customize-theme-title"
					>
						{__('Theme Title', 'quillforms')}
					</label>
					<TextControl
						id="quillforms-customize-theme-title"
						className="theme-editor-customize__theme-title-field"
						value={title}
						placeholder={__('Theme Title', 'quillforms')}
						onChange={(val) => {
							setCurrentThemeTitle(val);
						}}
					/>
				</div>
				<PanelBody
					title={__('Background', 'quillforms')}
					initialOpen={false}
				>
					<div className="theme-editor-customize__notice">
						<p>
							{__(
								'To add a background image, clear the background overlay color or add opacity to it.',
								'quillforms'
							)}
						</p>
					</div>

					<div className="theme-editor-customize__subsection">
						{isEmpty(backgroundImage) && (
							<div className="theme-editor-customize__subsection-label">
								{__('Background Image', 'quillforms')}
							</div>
						)}
						{isEmpty(backgroundImage) ? (
							<MediaUpload
								onSelect={(media) =>
									setCurrentThemeProperties({
										backgroundImage: media.url,
									})
								}
								allowedTypes={['image']}
								render={({ open }) => (
									<button
										type="button"
										className="theme-editor-customize__dropzone"
										onClick={open}
									>
										<span
											className="theme-editor-customize__dropzone-icon"
											aria-hidden="true"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="40"
												height="40"
												viewBox="0 0 40 40"
												fill="none"
											>
												<path
													d="M25.9304 13.0731C25.731 13.0731 25.3324 13.0731 25.133 12.8738L19.9503 7.49169L14.7676 12.6744C14.3689 13.0731 13.7709 13.0731 13.3722 12.6744C12.9736 12.2757 12.9736 11.6777 13.3722 11.2791L19.3523 5.299C19.751 4.90033 20.349 4.90033 20.7477 5.299L26.7277 11.2791C27.1264 11.6777 27.1264 12.2757 26.7277 12.6744C26.5284 13.0731 26.1297 13.0731 25.9304 13.0731Z"
													fill="#B2328C"
												/>
												<path
													d="M19.9508 24.0364C19.3528 24.0364 18.9541 23.6377 18.9541 23.0397V7.09287C18.9541 6.49486 19.3528 6.09619 19.9508 6.09619C20.5488 6.09619 20.9475 6.49486 20.9475 7.09287V23.0397C20.9475 23.6377 20.5488 24.0364 19.9508 24.0364Z"
													fill="#B2328C"
												/>
												<path
													d="M29.9169 35H9.98339C7.19269 35 5 32.8073 5 30.0166V26.0299C5 25.4319 5.39867 25.0332 5.99668 25.0332C6.59468 25.0332 6.99336 25.4319 6.99336 26.0299V30.0166C6.99336 31.6113 8.38871 33.0066 9.98339 33.0066H29.9169C31.5116 33.0066 32.907 31.6113 32.907 30.0166V26.0299C32.907 25.4319 33.3057 25.0332 33.9037 25.0332C34.5017 25.0332 34.9003 25.4319 34.9003 26.0299V30.0166C34.9003 32.8073 32.7076 35 29.9169 35Z"
													fill="#B2328C"
												/>
											</svg>
										</span>
										<span className="theme-editor-customize__dropzone-text">
											<span className="theme-editor-customize__dropzone-text-main">
												{__(
													'Click to upload an image or ',
													'quillforms'
												)}
											</span>
											<span className="theme-editor-customize__dropzone-text-accent">
												{__(
													'Drag & Drop',
													'quillforms'
												)}
											</span>
										</span>
									</button>
								)}
							/>
						) : (
							<div className="theme-editor-customize__media-block theme-editor-customize__media-block--has-image">
								<div className="theme-editor-customize__bg-image-header">
									<div className="theme-editor-customize__bg-image-title">
										{__('Bg Image', 'quillforms')}
									</div>
									<div className="theme-editor-customize__bg-image-actions">
										<MediaUpload
											onSelect={(media) =>
												setCurrentThemeProperties({
													backgroundImage: media.url,
												})
											}
											allowedTypes={['image']}
											render={({ open }) => (
												<Tooltip
													text={__(
														'Replace',
														'quillforms'
													)}
												>
													<button
														type="button"
														className="theme-editor-customize__bg-image-icon-btn theme-editor-customize__bg-image-icon-btn--replace"
														onClick={open}
														aria-label={__(
															'Replace',
															'quillforms'
														)}
													>
														<BgImageReplaceIcon />
													</button>
												</Tooltip>
											)}
										/>
										<Tooltip
											text={__('Delete', 'quillforms')}
										>
											<button
												type="button"
												className="theme-editor-customize__bg-image-icon-btn theme-editor-customize__bg-image-icon-btn--delete"
												onClick={() =>
													setCurrentThemeProperties({
														backgroundImage: '',
													})
												}
												aria-label={__(
													'Delete',
													'quillforms'
												)}
											>
												<BgImageDeleteIcon />
											</button>
										</Tooltip>
									</div>
								</div>
								<div className="theme-editor-customize__bg-image-focal-panel">
									<div
										className="theme-editor-customize__bg-image-note"
										role="note"
									>
										<span
											className="theme-editor-customize__bg-image-note-icon"
											aria-hidden="true"
										>
											<BgImageNoteIcon />
										</span>
										<p>
											{__(
												'You can specify focal point from this image',
												'quillforms'
											)}
										</p>
									</div>
									<div className="theme-editor-customize__focal-wrap theme-editor-customize__focal-wrap--bg-image">
										<div className="theme-editor-customize__focal-picker">
											<FocalPointPicker
												url={backgroundImage}
												value={backgroundImageFocalPoint}
												onDragStart={(val) => {
													setCurrentThemeProperties({
														backgroundImageFocalPoint:
															val,
													});
												}}
												onDrag={(val) => {
													setCurrentThemeProperties({
														backgroundImageFocalPoint:
															val,
													});
												}}
												onChange={(val) => {
													setCurrentThemeProperties({
														backgroundImageFocalPoint:
															val,
													});
												}}
											/>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>

					<div className="theme-editor-customize__subsection">
						<div className="theme-editor-customize__subsection-label">
							{__('Background Overlay Color', 'quillforms')}
						</div>
						<div className="theme-editor-customize__overlay-color theme-editor-customize__overlay-color--footer-clear">
							<div className="theme-editor-customize__combo-wrap">
								<ComboColorPicker
									color={backgroundColor}
									setColor={(value) => {
										const next =
											value === undefined ||
											value === null ||
											value === ''
												? 'rgba(0, 0, 0, 0)'
												: value;
										setCurrentThemeProperties({
											backgroundColor: next,
										});
									}}
								/>
							</div>
							<div className="theme-editor-customize__subsection-clear-row">
								<button
									type="button"
									className={
										'theme-editor-customize__clear-link theme-editor-customize__clear-link--overlay' +
										(shouldEmphasizeBackgroundOverlayClear(
											backgroundColor
										)
											? ' theme-editor-customize__clear-link--has-value'
											: '')
									}
									onClick={() =>
										setCurrentThemeProperties({
											backgroundColor: 'rgba(0, 0, 0, 0)',
										})
									}
								>
									{__('Clear', 'quillforms')}
								</button>
							</div>
						</div>
					</div>
				</PanelBody>

				<PanelBody title={__('Logo', 'quillforms')} initialOpen={false}>
					<div className="theme-editor-customize__subsection">
						{(isEmpty(logo) || !logo?.src) && (
							<div className="theme-editor-customize__subsection-label">
								{__('Logo', 'quillforms')}
							</div>
						)}
						{isEmpty(logo) || !logo?.src ? (
							<MediaUpload
								onSelect={(media) =>
									setCurrentThemeProperties({
										logo: {
											type: 'image',
											src: media.url,
										},
									})
								}
								allowedTypes={['image']}
								render={({ open }) => (
									<button
										type="button"
										className="theme-editor-customize__dropzone"
										onClick={open}
									>
										<span
											className="theme-editor-customize__dropzone-icon"
											aria-hidden="true"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="40"
												height="40"
												viewBox="0 0 40 40"
												fill="none"
											>
												<path
													d="M25.9304 13.0731C25.731 13.0731 25.3324 13.0731 25.133 12.8738L19.9503 7.49169L14.7676 12.6744C14.3689 13.0731 13.7709 13.0731 13.3722 12.6744C12.9736 12.2757 12.9736 11.6777 13.3722 11.2791L19.3523 5.299C19.751 4.90033 20.349 4.90033 20.7477 5.299L26.7277 11.2791C27.1264 11.6777 27.1264 12.2757 26.7277 12.6744C26.5284 13.0731 26.1297 13.0731 25.9304 13.0731Z"
													fill="#B2328C"
												/>
												<path
													d="M19.9508 24.0364C19.3528 24.0364 18.9541 23.6377 18.9541 23.0397V7.09287C18.9541 6.49486 19.3528 6.09619 19.9508 6.09619C20.5488 6.09619 20.9475 6.49486 20.9475 7.09287V23.0397C20.9475 23.6377 20.5488 24.0364 19.9508 24.0364Z"
													fill="#B2328C"
												/>
												<path
													d="M29.9169 35H9.98339C7.19269 35 5 32.8073 5 30.0166V26.0299C5 25.4319 5.39867 25.0332 5.99668 25.0332C6.59468 25.0332 6.99336 25.4319 6.99336 26.0299V30.0166C6.99336 31.6113 8.38871 33.0066 9.98339 33.0066H29.9169C31.5116 33.0066 32.907 31.6113 32.907 30.0166V26.0299C32.907 25.4319 33.3057 25.0332 33.9037 25.0332C34.5017 25.0332 34.9003 25.4319 34.9003 26.0299V30.0166C34.9003 32.8073 32.7076 35 29.9169 35Z"
													fill="#B2328C"
												/>
											</svg>
										</span>
										<span className="theme-editor-customize__dropzone-text">
											<span className="theme-editor-customize__dropzone-text-main">
												{__(
													'Click to upload an image or ',
													'quillforms'
												)}
											</span>
											<span className="theme-editor-customize__dropzone-text-accent">
												{__(
													'Drag & Drop',
													'quillforms'
												)}
											</span>
										</span>
									</button>
								)}
							/>
						) : (
							<div className="theme-editor-customize__media-block theme-editor-customize__media-block--has-logo">
								<div className="theme-editor-customize__bg-image-header">
									<div className="theme-editor-customize__bg-image-title">
										{__('Logo', 'quillforms')}
									</div>
									<div className="theme-editor-customize__bg-image-actions">
										<MediaUpload
											onSelect={(media) =>
												setCurrentThemeProperties({
													logo: {
														type: 'image',
														src: media.url,
													},
												})
											}
											allowedTypes={['image']}
											render={({ open }) => (
												<Tooltip
													text={__(
														'Replace',
														'quillforms'
													)}
												>
													<button
														type="button"
														className="theme-editor-customize__bg-image-icon-btn theme-editor-customize__bg-image-icon-btn--replace"
														onClick={open}
														aria-label={__(
															'Replace',
															'quillforms'
														)}
													>
														<BgImageReplaceIcon />
													</button>
												</Tooltip>
											)}
										/>
										<Tooltip
											text={__(
												'Delete',
												'quillforms'
											)}
										>
											<button
												type="button"
												className="theme-editor-customize__bg-image-icon-btn theme-editor-customize__bg-image-icon-btn--delete"
												onClick={() =>
													setCurrentThemeProperties({
														logo: {},
													})
												}
												aria-label={__(
													'Delete',
													'quillforms'
												)}
											>
												<BgImageDeleteIcon />
											</button>
										</Tooltip>
									</div>
								</div>
								<div className="theme-editor-customize__media-preview theme-editor-customize__media-preview--logo">
									<img src={logo.src} alt="" />
								</div>
							</div>
						)}
					</div>
				</PanelBody>

				<PanelBody
					className="theme-editor-customize__font-family-panel"
					title={__('Font Family', 'quillforms')}
					initialOpen={false}
				>
					<div className="theme-editor-customize__font-family">
						<div className="theme-editor-customize__notice">
							<p>
								{__(
									'You can add your custom font from settings icon at left bar and then click on custom fonts.',
									'quillforms'
								)}
							</p>
						</div>
						<BaseControl>
							<ControlWrapper orientation="vertical">
								<ControlLabel
									label={__('Base Font', 'quillforms')}
								/>
								<FontPicker
									fonts={allFonts}
									selectedFont={font}
									setFont={(value) => {
										if (applyBaseFontToAll) {
											setCurrentThemeProperties({
												font: value,
												questionsLabelFont: value,
												questionsDescriptionFont: value,
											});
										} else {
											setCurrentThemeProperties({
												font: value,
											});
										}
									}}
								/>
							</ControlWrapper>
						</BaseControl>
						<div className="theme-editor-customize__apply-base-font">
							<CheckboxControl
								label={__(
									'Apply Base Font to all',
									'quillforms'
								)}
								checked={!!applyBaseFontToAll}
								onChange={(checked) => {
									if (checked) {
										setCurrentThemeProperties({
											applyBaseFontToAll: true,
											questionsLabelFont: font,
											questionsDescriptionFont: font,
										});
									} else {
										setCurrentThemeProperties({
											applyBaseFontToAll: false,
										});
									}
								}}
							/>
						</div>
						<BaseControl>
							<ControlWrapper orientation="vertical">
								<ControlLabel
									label={__(
										'Questions Label Font',
										'quillforms'
									)}
								/>
								<FontPicker
									fonts={{
										Inherit: 'inherit',
										...customFonts,
										...configApi.getFonts(),
									}}
									selectedFont={questionsLabelFont}
									disabled={!!applyBaseFontToAll}
									setFont={(value) => {
										setCurrentThemeProperties({
											questionsLabelFont: value,
										});
									}}
								/>
							</ControlWrapper>
						</BaseControl>
						<BaseControl>
							<ControlWrapper orientation="vertical">
								<ControlLabel
									label={__(
										'Questions Description Font',
										'quillforms'
									)}
								/>
								<FontPicker
									fonts={{
										Inherit: 'inherit',
										...customFonts,
										...configApi.getFonts(),
									}}
									selectedFont={questionsDescriptionFont}
									disabled={!!applyBaseFontToAll}
									setFont={(value) => {
										setCurrentThemeProperties({
											questionsDescriptionFont: value,
										});
									}}
								/>
							</ControlWrapper>
						</BaseControl>
					</div>
				</PanelBody>

				<PanelBody
					title={__('Colors', 'quillforms')}
					initialOpen={false}
				>
					<div className="theme-editor-customize__subsection">
						<div className="theme-editor-customize__subsection-label">
							{__('Questions Color', 'quillforms')}
						</div>
						<ThemeSolidColorCard
							color={questionsColor}
							schemaDefault={themeDefaults.questionsColor}
							onClear={() =>
								setCurrentThemeProperties({
									questionsColor:
										themeDefaults.questionsColor,
								})
							}
						>
							<AlphaColorPicker
								value={questionsColor}
								onChange={(value) => {
									setCurrentThemeProperties({
										questionsColor: normalizeThemeColor(
											value,
											themeDefaults.questionsColor
										),
									});
								}}
							/>
						</ThemeSolidColorCard>
					</div>
					<div className="theme-editor-customize__subsection">
						<div className="theme-editor-customize__subsection-label">
							{__('Answers Color', 'quillforms')}
						</div>
						<ThemeSolidColorCard
							color={answersColor}
							schemaDefault={themeDefaults.answersColor}
							onClear={() =>
								setCurrentThemeProperties({
									answersColor: themeDefaults.answersColor,
								})
							}
						>
							<AlphaColorPicker
								value={answersColor}
								onChange={(value) => {
									setCurrentThemeProperties({
										answersColor: normalizeThemeColor(
											value,
											themeDefaults.answersColor
										),
									});
								}}
							/>
						</ThemeSolidColorCard>
					</div>
					<div className="theme-editor-customize__subsection">
						<div className="theme-editor-customize__subsection-label">
							{__('Buttons Font Color', 'quillforms')}
						</div>
						<ThemeSolidColorCard
							color={buttonsFontColor}
							schemaDefault={themeDefaults.buttonsFontColor}
							onClear={() =>
								setCurrentThemeProperties({
									buttonsFontColor:
										themeDefaults.buttonsFontColor,
								})
							}
						>
							<AlphaColorPicker
								value={buttonsFontColor}
								onChange={(value) => {
									setCurrentThemeProperties({
										buttonsFontColor: normalizeThemeColor(
											value,
											themeDefaults.buttonsFontColor
										),
									});
								}}
							/>
						</ThemeSolidColorCard>
					</div>
					<div className="theme-editor-customize__subsection">
						<div className="theme-editor-customize__subsection-label">
							{__('Buttons Background Color', 'quillforms')}
						</div>
						<ThemeSolidColorCard
							color={buttonsBgColor}
							schemaDefault={themeDefaults.buttonsBgColor}
							onClear={() =>
								setCurrentThemeProperties({
									buttonsBgColor:
										themeDefaults.buttonsBgColor,
								})
							}
						>
							<AlphaColorPicker
								value={buttonsBgColor}
								onChange={(value) => {
									setCurrentThemeProperties({
										buttonsBgColor: normalizeThemeColor(
											value,
											themeDefaults.buttonsBgColor
										),
									});
								}}
							/>
						</ThemeSolidColorCard>
					</div>
					<div className="theme-editor-customize__subsection">
						<div className="theme-editor-customize__subsection-label">
							{__('Errors Text Color', 'quillforms')}
						</div>
						<ThemeSolidColorCard
							color={errorsFontColor}
							schemaDefault={themeDefaults.errorsFontColor}
							onClear={() =>
								setCurrentThemeProperties({
									errorsFontColor:
										themeDefaults.errorsFontColor,
								})
							}
						>
							<AlphaColorPicker
								value={errorsFontColor}
								onChange={(value) => {
									setCurrentThemeProperties({
										errorsFontColor: normalizeThemeColor(
											value,
											themeDefaults.errorsFontColor
										),
									});
								}}
							/>
						</ThemeSolidColorCard>
					</div>
					<div className="theme-editor-customize__subsection">
						<div className="theme-editor-customize__subsection-label">
							{__('Errors Background Color', 'quillforms')}
						</div>
						<ThemeSolidColorCard
							color={errorsBgColor}
							schemaDefault={themeDefaults.errorsBgColor}
							onClear={() =>
								setCurrentThemeProperties({
									errorsBgColor: themeDefaults.errorsBgColor,
								})
							}
						>
							<ComboColorPicker
								color={errorsBgColor}
								setColor={(value) => {
									setCurrentThemeProperties({
										errorsBgColor: normalizeThemeColor(
											value,
											themeDefaults.errorsBgColor
										),
									});
								}}
							/>
						</ThemeSolidColorCard>
					</div>
					<div className="theme-editor-customize__subsection">
						<div className="theme-editor-customize__subsection-head">
							<div className="theme-editor-customize__subsection-label">
								{__('Form Footer Bg Color', 'quillforms')}
							</div>
							<div
								className="theme-editor-customize__viewport-toggle"
								role="group"
								aria-label={__('Breakpoint', 'quillforms')}
							>
								<button
									type="button"
									className={
										'theme-editor-customize__viewport-btn' +
										(formFooterViewport === 'lg'
											? ' is-active'
											: '')
									}
									aria-pressed={formFooterViewport === 'lg'}
									onClick={() => setFormFooterViewport('lg')}
									aria-label={__('Desktop', 'quillforms')}
								>
									<IconDesktop />
								</button>
								<button
									type="button"
									className={
										'theme-editor-customize__viewport-btn' +
										(formFooterViewport === 'sm'
											? ' is-active'
											: '')
									}
									aria-pressed={formFooterViewport === 'sm'}
									onClick={() => setFormFooterViewport('sm')}
									aria-label={__('Mobile', 'quillforms')}
								>
									<IconMobile />
								</button>
							</div>
						</div>
						<ThemeSolidColorCard
							color={
								formFooterBgColor[formFooterBk] ??
								formFooterBgColor.lg
							}
							schemaDefault={
								themeDefaults.formFooterBgColor?.[formFooterBk] ??
								themeDefaults.formFooterBgColor?.lg
							}
							onClear={() =>
								setCurrentThemeProperties({
									formFooterBgColor: {
										...formFooterBgColor,
										[formFooterBk]:
											themeDefaults.formFooterBgColor?.[
												formFooterBk
											] ??
											themeDefaults.formFooterBgColor?.lg,
									},
								})
							}
						>
							<ComboColorPicker
								color={
									formFooterBgColor[formFooterBk] ??
									formFooterBgColor.lg
								}
								setColor={(value) => {
									setCurrentThemeProperties({
										formFooterBgColor: {
											...formFooterBgColor,
											[formFooterBk]: normalizeThemeColor(
												value,
												themeDefaults.formFooterBgColor?.[
													formFooterBk
												] ??
													themeDefaults.formFooterBgColor
														?.lg
											),
										},
									});
								}}
							/>
						</ThemeSolidColorCard>
					</div>
					<div className="theme-editor-customize__subsection">
						<div className="theme-editor-customize__subsection-label">
							{__('Progress Bar Fill Color', 'quillforms')}
						</div>
						<ThemeSolidColorCard
							color={progressBarFillColor}
							schemaDefault={themeDefaults.progressBarFillColor}
							onClear={() =>
								setCurrentThemeProperties({
									progressBarFillColor:
										themeDefaults.progressBarFillColor,
								})
							}
						>
							<AlphaColorPicker
								value={progressBarFillColor}
								onChange={(value) => {
									setCurrentThemeProperties({
										progressBarFillColor:
											normalizeThemeColor(
												value,
												themeDefaults.progressBarFillColor
											),
									});
								}}
							/>
						</ThemeSolidColorCard>
					</div>
					<div className="theme-editor-customize__subsection">
						<div className="theme-editor-customize__subsection-label">
							{__('Progress Bar Bg Color', 'quillforms')}
						</div>
						<ThemeSolidColorCard
							color={progressBarBgColor}
							schemaDefault={themeDefaults.progressBarBgColor}
							onClear={() =>
								setCurrentThemeProperties({
									progressBarBgColor:
										themeDefaults.progressBarBgColor,
								})
							}
						>
							<AlphaColorPicker
								value={progressBarBgColor}
								onChange={(value) => {
									setCurrentThemeProperties({
										progressBarBgColor: normalizeThemeColor(
											value,
											themeDefaults.progressBarBgColor
										),
									});
								}}
							/>
						</ThemeSolidColorCard>
					</div>
				</PanelBody>

				<TypographyPanel
					properties={$properties}
					setCurrentThemeProperties={setCurrentThemeProperties}
				/>
				<PanelBody
					className="theme-editor-customize__buttons-panel"
					title={__('Buttons', 'quillforms')}
					initialOpen={false}
				>
					<div className="theme-editor-customize__subsection">
						<div className="theme-editor-customize__buttons-padding-head">
							<span className="theme-editor-customize__subsection-label">
								{__('Button Padding', 'quillforms')}
							</span>
							<div
								className="theme-editor-customize__viewport-toggle"
								role="group"
								aria-label={__('Breakpoint', 'quillforms')}
							>
								<button
									type="button"
									className={
										'theme-editor-customize__viewport-btn' +
										(buttonsPaddingViewport === 'lg'
											? ' is-active'
											: '')
									}
									aria-pressed={buttonsPaddingViewport === 'lg'}
									onClick={() => setButtonsPaddingViewport('lg')}
									aria-label={__('Desktop', 'quillforms')}
								>
									<IconDesktop />
								</button>
								<button
									type="button"
									className={
										'theme-editor-customize__viewport-btn' +
										(buttonsPaddingViewport === 'sm'
											? ' is-active'
											: '')
									}
									aria-pressed={buttonsPaddingViewport === 'sm'}
									onClick={() => setButtonsPaddingViewport('sm')}
									aria-label={__('Mobile', 'quillforms')}
								>
									<IconMobile />
								</button>
							</div>
						</div>
						<ButtonsPaddingPreview
							padding={buttonsPadding}
							bk={paddingBk}
						/>
						<div className="theme-editor-customize__buttons-padding-grid">
							<TextControl
								label={__('Top', 'quillforms')}
								type="number"
								value={String(
									parseThemePaddingSide(
										buttonsPadding,
										'top',
										paddingBk
									)
								)}
								onChange={(val) => {
									const n = parseInt(String(val), 10);
									if (!Number.isFinite(n)) {
										return;
									}
									const clamped = Math.min(120, Math.max(0, n));
									setCurrentThemeProperties({
										buttonsPadding: {
											...buttonsPadding,
											top: {
												...buttonsPadding.top,
												[paddingBk]: `${clamped}px`,
											},
										},
									});
								}}
							/>
							<TextControl
								label={__('Bottom', 'quillforms')}
								type="number"
								value={String(
									parseThemePaddingSide(
										buttonsPadding,
										'bottom',
										paddingBk
									)
								)}
								onChange={(val) => {
									const n = parseInt(String(val), 10);
									if (!Number.isFinite(n)) {
										return;
									}
									const clamped = Math.min(120, Math.max(0, n));
									setCurrentThemeProperties({
										buttonsPadding: {
											...buttonsPadding,
											bottom: {
												...buttonsPadding.bottom,
												[paddingBk]: `${clamped}px`,
											},
										},
									});
								}}
							/>
							<TextControl
								label={__('Right', 'quillforms')}
								type="number"
								value={String(
									parseThemePaddingSide(
										buttonsPadding,
										'right',
										paddingBk
									)
								)}
								onChange={(val) => {
									const n = parseInt(String(val), 10);
									if (!Number.isFinite(n)) {
										return;
									}
									const clamped = Math.min(120, Math.max(0, n));
									setCurrentThemeProperties({
										buttonsPadding: {
											...buttonsPadding,
											right: {
												...buttonsPadding.right,
												[paddingBk]: `${clamped}px`,
											},
										},
									});
								}}
							/>
							<TextControl
								label={__('Left', 'quillforms')}
								type="number"
								value={String(
									parseThemePaddingSide(
										buttonsPadding,
										'left',
										paddingBk
									)
								)}
								onChange={(val) => {
									const n = parseInt(String(val), 10);
									if (!Number.isFinite(n)) {
										return;
									}
									const clamped = Math.min(120, Math.max(0, n));
									setCurrentThemeProperties({
										buttonsPadding: {
											...buttonsPadding,
											left: {
												...buttonsPadding.left,
												[paddingBk]: `${clamped}px`,
											},
										},
									});
								}}
							/>
						</div>
					</div>

					<hr
						className="theme-editor-customize__buttons-panel-divider"
						aria-hidden="true"
					/>

					<div className="theme-editor-customize__subsection">
						<div className="theme-editor-customize__subsection-label">
							{__('Border Radius (px)', 'quillforms')}
						</div>
						<TextControl
							type="number"
							value={String(buttonsBorderRadius)}
							onChange={(val) => {
								const n = parseInt(String(val), 10);
								if (!Number.isFinite(n)) {
									return;
								}
								const clamped = Math.min(60, Math.max(0, n));
								setCurrentThemeProperties({
									buttonsBorderRadius: clamped,
								});
							}}
						/>
					</div>

					<div className="theme-editor-customize__subsection">
						<div className="theme-editor-customize__subsection-label">
							{__('Border Width (px)', 'quillforms')}
						</div>
						<TextControl
							type="number"
							value={String(buttonsBorderWidth)}
							onChange={(val) => {
								const n = parseInt(String(val), 10);
								if (!Number.isFinite(n)) {
									return;
								}
								const clamped = Math.min(20, Math.max(0, n));
								setCurrentThemeProperties({
									buttonsBorderWidth: clamped,
								});
							}}
						/>
					</div>

					<div className="theme-editor-customize__subsection">
						<div className="theme-editor-customize__subsection-label">
							{__('Border Color', 'quillforms')}
						</div>
						<ThemeSolidColorCard
							color={buttonsBorderColor}
							schemaDefault={themeDefaults.buttonsBorderColor}
							onClear={() =>
								setCurrentThemeProperties({
									buttonsBorderColor:
										themeDefaults.buttonsBorderColor,
								})
							}
						>
							<AlphaColorPicker
								value={buttonsBorderColor}
								onChange={(value) => {
									setCurrentThemeProperties({
										buttonsBorderColor: normalizeThemeColor(
											value,
											themeDefaults.buttonsBorderColor
										),
									});
								}}
							/>
						</ThemeSolidColorCard>
					</div>
				</PanelBody>
			</div>
			<CustomizeFooter
				themeTitle={title}
				themeProperties={theme.properties}
				themeId={currentThemeId}
				canSave={shouldBeSaved}
			/>
		</div>
	);
};
export default CustomizeThemePanel;
