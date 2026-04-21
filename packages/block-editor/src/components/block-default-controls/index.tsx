/**
 * QuillForms Dependencies
 */
import {
	ToggleControl,
	BaseControl,
	ComboboxControl,
	ControlWrapper,
	ControlLabel,
	TextControl,
} from '@quillforms/admin-components';

// @ts-expect-error
import { ThemeCard, ThemeListItem } from '@quillforms/theme-editor';
import type { BlockAttributes, FormBlock } from '@quillforms/types';

/**
 * WordPress Dependencies
 */
import { FocalPointPicker, RangeControl, Tooltip } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { MediaUpload, uploadMedia } from '@wordpress/media-utils';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { css } from 'emotion';
/**
 * Internal Dependencies
 */
import BlockThemeControl from '../block-theme';
import CustomHTML from '../block-custom-html';
import BlockLayout from '../block-layout';
import BorderRadiusTemplates from '../border-radius-templates';
import AlignControl from '../block-align';

const AttachmentUploadIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={40}
		height={40}
		viewBox="0 0 40 40"
		fill="none"
		aria-hidden
		className="block-editor-default-attachment__upload-icon"
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
);

const WidthControl = ({ value, onChange }) => {
	const widthOptions = [
		{
			key: '100%',
			name: 'Full Width',
			icon: (
				<svg width="40" height="28" viewBox="0 0 40 28" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect x="2" y="4" width="36" height="20" rx="2" fill="currentColor" fillOpacity="0.1" />
					<rect x="4" y="6" width="32" height="16" rx="1" stroke="currentColor" strokeWidth="2" />
					<rect x="8" y="10" width="24" height="2" fill="currentColor" />
					<rect x="8" y="16" width="16" height="2" fill="currentColor" />
				</svg>
			)
		},
		{
			key: '50%',
			name: 'Half Width',
			icon: (
				<svg width="40" height="28" viewBox="0 0 40 28" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect x="2" y="4" width="36" height="20" rx="2" fill="currentColor" fillOpacity="0.1" />
					<rect x="4" y="6" width="16" height="16" rx="1" stroke="currentColor" strokeWidth="2" />
					<rect x="8" y="10" width="8" height="2" fill="currentColor" />
					<rect x="8" y="16" width="6" height="2" fill="currentColor" />
				</svg>
			)
		},
		{
			key: '33%',
			name: 'One Third',
			icon: (
				<svg width="40" height="28" viewBox="0 0 40 28" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect x="2" y="4" width="36" height="20" rx="2" fill="currentColor" fillOpacity="0.1" />
					<rect x="4" y="6" width="11" height="16" rx="1" stroke="currentColor" strokeWidth="2" />
					<rect x="7" y="10" width="5" height="2" fill="currentColor" />
					<rect x="7" y="16" width="4" height="2" fill="currentColor" />
				</svg>
			)
		}
	];

	return (
		<div className={css`
            display: flex;
            gap: 8px;
            width: 100%;
        `}>
			{widthOptions.map((option) => (
				<button
					key={option.key}
					className={css`
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 8px;
                        padding: 12px 8px;
                        background: #fff;
                        color: ${value === option.key ? 'var(--wp-admin-theme-color)' : '#1e1e1e'};
                        border: 2px solid ${value === option.key ? 'var(--wp-admin-theme-color)' : '#e2e4e7'};
                        border-radius: 6px;
                        cursor: pointer;
                        transition: all 0.2s ease;

                        &:hover {
                            border-color: var(--wp-admin-theme-color);
                            color: var(--wp-admin-theme-color);
                        }

                        svg {
                            width: 40px;
                            height: 28px;
                        }

                        span {
                            font-size: 11px;
                            font-weight: 500;
                        }
                    `}
					onClick={() => onChange(option.key)}
				>
					{option.icon}
					<span>{option.name}</span>
				</button>
			))}
		</div>
	);
};
interface Props {
	blockName: string;
	attributes?: BlockAttributes;
	setAttributes: (x: Record<string, unknown>) => void;
	isChild?: boolean;
	parentBlock: FormBlock;
}
const DefaultControls: React.FC<Props> = ({
	blockName,
	isChild,
	attributes,
	setAttributes,
	parentBlock
}) => {
	const {
		editableSupport,
		requiredSupport,
		attachmentSupport,
		themeSupport,
		defaultValueSupport,
		numericSupport,
		placeholderSupport,
		alignSupport,
		maxUploadFileSize,
		wpAllowedMimeTypes,
	} = useSelect((select) => {
		let maxUpload: number | undefined;
		let mimeTypes: Record<string, string> | null = null;
		try {
			const blockEditor = select('core/block-editor') as {
				getSettings?: () => {
					maxUploadFileSize?: number;
					allowedMimeTypes?: Record<string, string> | null;
				};
			};
			const mediaSettings = blockEditor?.getSettings?.();
			maxUpload = mediaSettings?.maxUploadFileSize;
			mimeTypes = mediaSettings?.allowedMimeTypes ?? null;
		} catch {
			/* core/block-editor optional in some screens */
		}
		return {
			editableSupport: select('quillForms/blocks').hasBlockSupport(
				blockName,
				'editable'
			),
			requiredSupport: select('quillForms/blocks').hasBlockSupport(
				blockName,
				'required'
			),
			attachmentSupport: select('quillForms/blocks').hasBlockSupport(
				blockName,
				'attachment'
			),
			themeSupport: select('quillForms/blocks').hasBlockSupport(
				blockName,
				'theme'
			),
			defaultValueSupport: select('quillForms/blocks').hasBlockSupport(
				blockName,
				'defaultValue'
			),
			placeholderSupport: select('quillForms/blocks').hasBlockSupport(
				blockName,
				'placeholder'
			),
			numericSupport: select('quillForms/blocks').hasBlockSupport(
				blockName,
				'numeric'
			),
			alignSupport: select('quillForms/blocks').hasBlockSupport(
				blockName,
				'align'
			),
			maxUploadFileSize: maxUpload,
			wpAllowedMimeTypes: mimeTypes,
		};
	});
	let required, attachment, blockTheme, defaultValue;
	if (attributes) {
		required = attributes.required;
		attachment = attributes.attachment;
		blockTheme = attributes.themeId;
		defaultValue = attributes.defaultValue ?? '';
	}


	const widthOptions = [
		{ key: '100%', name: __('100%', 'quillforms') },
		{ key: '50%', name: __('50%', 'quillforms') },
		{ key: '33%', name: __('33%', 'quillforms') },
	]
	return (
		<div className="block-editor-block-default-controls">
			{editableSupport && requiredSupport && (
				<BaseControl>
					<ControlWrapper>
						<ControlLabel label={__('Required', 'quillforms')} />
						<ToggleControl
							checked={required}
							onChange={() =>
								setAttributes({
									required: !required,
								})
							}
						/>
					</ControlWrapper>
				</BaseControl>
			)}

			{attachmentSupport && !isChild && (
				<>
					<BaseControl>
						<div className="block-editor-default-attachment">
							<div className="block-editor-default-attachment__header">
								<div className="block-editor-default-attachment__title-wrap">
									<span className="block-editor-default-attachment__heading">
										{__('Upload an image/video', 'quillforms')}
									</span>
									<Tooltip
										text={__(
											'Add an image or an embedded YouTube video alongside this question.',
											'quillforms'
										)}
									>
										<button
											type="button"
											className="block-editor-default-attachment__info"
											aria-label={__('More information', 'quillforms')}
										>
											<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" fill="none">
												<path d="M15.1511 27.9999C14.8306 27.9518 14.5047 27.9091 14.1841 27.861C12.747 27.6527 11.4007 27.1879 10.1398 26.4719C9.9635 26.3704 9.82459 26.3544 9.62692 26.4399C8.36607 26.9848 7.04112 27.2413 5.66274 27.1985C5.36355 27.1878 5.12848 27.081 4.99492 26.8032C4.86669 26.5307 4.92012 26.2743 5.11245 26.0445C5.7215 25.318 6.15425 24.4952 6.47481 23.6083C6.52823 23.4587 6.5122 23.3519 6.41604 23.2237C5.2193 21.653 4.43395 19.8952 4.15079 17.9506C3.52037 13.5536 4.86669 9.85123 8.18977 6.89679C9.94213 5.33676 12.015 4.39113 14.3444 4.10797C18.6078 3.58974 22.2033 4.94675 25.0669 8.15229C26.6376 9.91534 27.5459 12.0043 27.8931 14.3443C27.9305 14.6115 27.9626 14.8839 28 15.1511V16.8393C27.984 16.9088 27.9626 16.9729 27.9519 17.0423C27.8931 17.459 27.8557 17.8811 27.7756 18.2925C27.2681 20.8783 26.0339 23.0634 24.0946 24.8425C22.3903 26.4132 20.3922 27.4069 18.1056 27.8129C17.6835 27.8877 17.2614 27.9412 16.8394 27.9999H15.1511ZM5.88178 26.3918C6.04206 26.3918 6.14891 26.3918 6.25576 26.3918C7.42578 26.3491 8.53704 26.0819 9.58952 25.5691C9.82459 25.4569 10.0169 25.4675 10.2467 25.6011C12.5333 26.9528 14.9909 27.4496 17.6194 27.0703C19.9114 26.7391 21.9255 25.7934 23.5977 24.196C26.4079 21.514 27.5833 18.2177 27.0597 14.3604C26.7498 12.0684 25.7775 10.0596 24.1854 8.38736C21.6156 5.68403 18.4422 4.49263 14.7237 4.88264C12.3089 5.13374 10.1932 6.10075 8.43553 7.76228C5.70013 10.3321 4.5034 13.5109 4.87738 17.256C5.07505 19.2702 5.7963 21.092 7.03578 22.6841C7.38304 23.1275 7.40441 23.4908 7.21208 23.977C6.8755 24.8211 6.46946 25.6225 5.88178 26.3972V26.3918Z" fill="#236294" />
												<path d="M15.4025 24.8209C14.0936 24.8743 13.3082 23.9875 13.1159 23.1861C13.0197 22.7854 13.0357 22.4007 13.1479 22.0107C13.6395 20.2744 14.1256 18.5327 14.6118 16.7964C14.8095 16.0965 14.5103 15.6531 13.789 15.5729C13.4631 15.5355 13.212 15.2898 13.1907 14.9585C13.1746 14.6967 13.1746 14.4296 13.1907 14.1625C13.2067 13.8793 13.4097 13.6282 13.6875 13.5748C14.3928 13.4359 15.0926 13.2703 15.8032 13.2008C17.1495 13.0619 18.1806 14.2747 17.8921 15.605C17.438 17.7313 16.9786 19.8523 16.5244 21.9787C16.4657 22.2565 16.5832 22.4114 16.8664 22.3847C17.0801 22.3633 17.2991 22.3152 17.4968 22.2404C17.9509 22.0748 18.3516 22.2404 18.5119 22.6946C18.576 22.8762 18.6401 23.0632 18.6935 23.2502C18.8004 23.6242 18.6828 23.9233 18.3463 24.1264C17.7799 24.4629 17.1549 24.6286 16.5138 24.7141C16.1451 24.7675 15.7711 24.7888 15.3972 24.8209H15.4025ZM14.0081 14.7609C15.1407 14.9585 15.7231 15.9576 15.3704 17.1276C14.8469 18.8426 14.3874 20.5736 13.9119 22.2992C13.6822 23.1327 14.2325 23.934 15.0926 23.9821C15.5574 24.0035 16.0276 23.9554 16.4924 23.8966C16.9892 23.8379 17.4647 23.7043 17.9188 23.4425C17.8654 23.2983 17.8173 23.1594 17.7746 23.0472C17.5075 23.1006 17.2617 23.1647 17.016 23.1968C16.1505 23.309 15.5628 22.6465 15.7444 21.7917C16.1985 19.676 16.6527 17.5604 17.1068 15.4394C17.2884 14.5899 16.6313 13.8954 15.7711 14.0289C15.2636 14.1091 14.7614 14.2266 14.2538 14.2907C14.0295 14.3228 13.976 14.4136 14.0027 14.6059C14.0081 14.6593 14.0134 14.7128 14.0188 14.7662L14.0081 14.7609Z" fill="#236294" />
												<path d="M16.3903 11.5929C15.2737 11.5929 14.3921 10.7007 14.3975 9.5788C14.4028 8.47288 15.2897 7.59136 16.3956 7.5967C17.5122 7.5967 18.3991 8.49425 18.3884 9.61085C18.3777 10.7168 17.4962 11.5983 16.3903 11.5929ZM17.587 9.60017C17.587 8.94303 17.0581 8.40343 16.4009 8.39809C15.7385 8.39809 15.1882 8.93769 15.1935 9.60017C15.1935 10.252 15.7438 10.7916 16.3903 10.7916C17.0421 10.7916 17.5817 10.252 17.587 9.60017Z" fill="#236294" />
											</svg>
										</button>
									</Tooltip>
								</div>
								<ToggleControl
									checked={attachment !== undefined}
									className="attachment-toggle-control"
									onChange={() => {
										if (attachment) {
											setAttributes({ attachment: undefined });
										} else {
											setAttributes({ attachment: { type: 'image', url: '' } });
										}
									}}
								/>
							</div>
							{!!attachment && (
								<div className="block-editor-default-attachment__panel">
									<div className="block-editor-default-attachment__type-row">
										<button
											type="button"
											className={
												(attachment?.type || 'image') === 'image'
													? 'block-editor-default-attachment__type-btn is-selected'
													: 'block-editor-default-attachment__type-btn'
											}
											onClick={() =>
												setAttributes({ attachment: { type: 'image', url: '' } })
											}
										>
											<span>{__('Image', 'quillforms')}</span>
										</button>
										<button
											type="button"
											className={
												attachment?.type === 'video'
													? 'block-editor-default-attachment__type-btn is-selected'
													: 'block-editor-default-attachment__type-btn'
											}
											onClick={() =>
												setAttributes({ attachment: { type: 'video', url: '' } })
											}
										>
											<span>{__('Video', 'quillforms')}</span>
										</button>
									</div>
									{attachment?.type === 'video' ? (
										<div className="block-editor-default-attachment__video-field">
											<label className="block-editor-default-attachment__field-label screen-reader-text">
												{__('YouTube Video URL', 'quillforms')}
											</label>
											<TextControl
												value={attachment?.url || ''}
												onChange={(val) =>
													setAttributes({ attachment: { type: 'video', url: val } })
												}
												placeholder={__(
													'Paste YouTube video URL here',
													'quillforms'
												)}
											/>
										</div>
									) : (
										<div className="block-editor-default-attachment__image-zone">
											{attachment?.url ? (
												<div className="block-editor-default-attachment__image-preview">
													<div className="block-editor-default-attachment__image-preview-frame">
														<img src={attachment.url} alt="" />
														<button
															type="button"
															className="block-editor-default-attachment__remove-image"
															onClick={() =>
																setAttributes({
																	attachment: {
																		type: 'image',
																		url: '',
																	},
																})
															}
														>
															{__('Remove', 'quillforms')}
														</button>
													</div>
												</div>
											) : (
												<MediaUpload
													onSelect={(media) =>
														setAttributes({
															attachment: {
																type: 'image',
																url: media.url,
															},
														})
													}
													allowedTypes={['image']}
													render={({ open }) => (
														<button
															type="button"
															className="block-editor-default-attachment__dropzone"
															onClick={open}
															onDragOver={(e) => {
																e.preventDefault();
																e.stopPropagation();
															}}
															onDrop={(e) => {
																e.preventDefault();
																e.stopPropagation();
																const files = Array.from(
																	e.dataTransfer.files
																).filter((f) =>
																	f.type.startsWith('image/')
																);
																if (!files.length) {
																	return;
																}
																uploadMedia({
																	allowedTypes: ['image'],
																	filesList: files,
																	maxUploadFileSize,
																	wpAllowedMimeTypes:
																		wpAllowedMimeTypes ?? undefined,
																	onFileChange: (attachments) => {
																		const last =
																			attachments?.[
																			attachments.length - 1
																			];
																		if (last?.url) {
																			setAttributes({
																				attachment: {
																					type: 'image',
																					url: last.url,
																				},
																			});
																		}
																	},
																});
															}}
															onKeyDown={(e) => {
																if (e.key === 'Enter' || e.key === ' ') {
																	e.preventDefault();
																	open();
																}
															}}
														>
															<AttachmentUploadIcon />
															<span className="block-editor-default-attachment__dropzone-text">
																<span className="block-editor-default-attachment__dropzone-line1">
																	{__(
																		'Click to upload an image or',
																		'quillforms'
																	)}
																</span>
																<span className="block-editor-default-attachment__dropzone-line2">
																	{__('Drag & Drop', 'quillforms')}
																</span>
															</span>
														</button>
													)}
												/>
											)}
										</div>
									)}
								</div>
							)}
						</div>
					</BaseControl>
					{!!attachment && (
						<>
							<BaseControl>
								<ControlWrapper orientation="vertical">
									<ControlLabel label={__('Layout', 'quillforms')}></ControlLabel>
									<div className="block-editor-default-attachment__layout-slot">
										<BlockLayout
											layout={attributes?.layout}
											setAttributes={setAttributes}
										/>
									</div>
								</ControlWrapper>
							</BaseControl>

							{(attributes?.layout === 'split-left' ||
								attributes?.layout === 'split-right') &&
								attributes?.attachment?.url && (
									<BaseControl>
										<ControlWrapper orientation="vertical">
										<ControlLabel label={__('Focal Point Picker', 'quillforms')}></ControlLabel>
											<div className="block-editor-default-attachment__focal-panel">
												<div className="block-editor-default-attachment__focal-wrap">
													<div className="block-editor-default-attachment__focal-picker">
														<FocalPointPicker
															url={attributes?.attachment?.url}
															value={
																attributes?.attachmentFocalPoint
															}
															onDragStart={(val) => {
																setAttributes({
																	attachmentFocalPoint: val,
																});
															}}
															onDrag={(val) => {
																setAttributes({
																	attachmentFocalPoint: val,
																});
															}}
															onChange={(val) => {
																setAttributes({
																	attachmentFocalPoint: val,
																});
															}}
														/>
													</div>
												</div>
											</div>
										</ControlWrapper>
									</BaseControl>
								)}

							{(attributes?.layout === 'float-left' ||
								attributes?.layout === 'float-right' ||
								attributes?.layout === 'stack') &&
								attributes?.attachment?.url && (
									<>
										<BaseControl>
											<ControlWrapper orientation="horizontal">
												<ControlLabel label={__('Set Maximum Width for attachment', 'quillforms')} />
												<ToggleControl
													checked={
														attributes?.attachmentMaxWidth !==
														'none'
													}
													onChange={() => {
														if (
															attributes?.attachmentMaxWidth ===
															'none'
														) {
															setAttributes({
																attachmentMaxWidth:
																	'200px',
															});
														} else {
															setAttributes({
																attachmentMaxWidth:
																	'none',
															});
														}
													}}
												/>
											</ControlWrapper>
											<>
												{attributes.attachmentMaxWidth !==
													'none' && (
														<ControlWrapper orientation="vertical">
															<ControlLabel label={__('Maximum Width(px)', 'quillforms')} />
															<RangeControl
																color="#b2328c"
																trackColor="#b2328c"
																railColor="#e2e8f0"
																value={parseInt(
																	attributes?.attachmentMaxWidth?.replace(
																		'px',
																		''
																	) ?? '0'
																)}
																onChange={(value) =>
																	setAttributes({
																		attachmentMaxWidth:
																			value + 'px',
																	})
																}
																min={50}
																max={900}
															/>
														</ControlWrapper>
													)}
											</>
										</BaseControl>
										{attachment?.type !== 'video' && (
											<BaseControl>
												<ControlWrapper orientation="horizontal">
													<ControlLabel label={__('Use Fancy Border Radius', 'quillforms')} />
													<ToggleControl
														checked={
															attributes?.attachmentFancyBorderRadius
														}
														onChange={() => {
															if (
																attributes.attachmentFancyBorderRadius
															) {
																setAttributes({
																	attachmentBorderRadius:
																		'0px',
																});
															}
															setAttributes({
																attachmentFancyBorderRadius:
																	!attributes.attachmentFancyBorderRadius,
															});
														}}
													/>
												</ControlWrapper>
												{attributes.attachmentFancyBorderRadius && (
													<ControlWrapper orientation="vertical">
														<ControlLabel label={__('Choose your favorite fancy border radius', 'quillforms')} />
														<BorderRadiusTemplates
															onChange={(val) => {
																setAttributes({
																	attachmentBorderRadius:
																		val,
																});
															}}
															attachmentBorderRadius={
																attributes.attachmentBorderRadius
															}
														/>
													</ControlWrapper>
												)}
											</BaseControl>
										)}
									</>
								)}
						</>
					)}
				</>
			)}
			{alignSupport && (
				<BaseControl>
					<ControlWrapper orientation="vertical">
						<ControlLabel label={__('Align', 'quillforms')} isNew />
						<AlignControl
							value={attributes?.align ?? 'left'}
							onChange={(align) => {
								setAttributes({ align });
							}}
						/>
					</ControlWrapper>
				</BaseControl>
			)}

			{defaultValueSupport && (
				<BaseControl>
					<ControlWrapper orientation="vertical">
						<ControlLabel label={__('Default Value', 'quillforms')} />
						<div
							className={css`
								.combobox-control-rich-text-back {
									display: none;
								}
								padding-top: 4px !important;
							` }
						>
							<ComboboxControl
								value={{ type: 'text', value: defaultValue }}
								onChange={(val) => {
									setAttributes({
										defaultValue: val?.value == '0' ? '0' : val?.value ?? '',
									});
								}}
								hideChooseOption={true}
								customize={(value) => {
									let { sections, options } = value;

									sections = sections.filter((section) =>
										[
											'hidden_fields',
											'variables',
										].includes(section.key)
									);

									options = options.filter((option) => {
										if (option.type === 'field') {
											return false;
										} else if (
											[
												'variable',
												'hidden_field',
											].includes(option.type)
										) {
											return true;
										}
										return false;
									});
									if (!numericSupport) {
										sections.push({
											key: 'user',
											label: 'Logged In User',
										});
										options.push({
											type: 'user',
											value: 'username',
											label: 'User username',
											isMergeTag: true,
										});
										options.push({
											type: 'user',
											value: 'email',
											label: 'User email',
											isMergeTag: true,
										});
										options.push({
											type: 'user',
											value: 'display_name',
											label: 'User display name',
											isMergeTag: true,
										});
									}
									return { sections, options };
								}}
							/>
						</div>
					</ControlWrapper>
				</BaseControl>
			)}
			{isChild && parentBlock.attributes?.layout === 'stack' && (
				<BaseControl>
					<ControlWrapper orientation='vertical'>
						<ControlLabel label={__('Width', 'quillforms')} isNew />
						<WidthControl
							value={attributes?.width ?? '100%'}
							onChange={(width) => {
								setAttributes({ width });
							}}
						/>

					</ControlWrapper>
				</BaseControl>
			)}
			{placeholderSupport && (
				<BaseControl>
					<div className="block-editor-block-default-controls__placeholder-override">
						<ControlWrapper>
							<ControlLabel
								label={__('Override default placeholder', 'quillforms')}
							/>
							<ToggleControl
								checked={attributes?.placeholder !== false}
								onChange={() =>
									setAttributes({
										placeholder:
											attributes?.placeholder === false
												? ''
												: false,
									})
								}
							/>
						</ControlWrapper>
						{attributes?.placeholder !== false && (
							<TextControl
								value={attributes?.placeholder}
								onChange={(val) => {
									setAttributes({
										placeholder: val,
									});
								}}
							/>
						)}
					</div>
				</BaseControl>
			)}
			{!isChild && (
				<>
					<BaseControl>
						<ControlWrapper orientation="vertical">
							<ControlLabel label={__('Custom HTML', 'quillforms')} />
							<CustomHTML
								value={attributes?.customHTML}
								onChange={(val) => {
									setAttributes({ customHTML: val });
								}}
							/>
						</ControlWrapper>
					</BaseControl>
					{themeSupport && (
						<BlockThemeControl
							blockTheme={blockTheme}
							setAttributes={setAttributes}
						/>
					)}
				</>
			)}
			{(
				blockName === 'multiple-choice' ||
				blockName === 'dropdown' ||
				blockName === 'picture-choice'
			) && (
					<BaseControl>
						<ControlWrapper orientation="horizontal">
							<ControlLabel label={__('Randomize', 'quillforms')}></ControlLabel>
							<ToggleControl
								checked={attributes?.randomize ?? false}
								onChange={() => {
									setAttributes({
										randomize: !attributes?.randomize,
									});
								}}
							/>
						</ControlWrapper>
						<>
							{attributes?.randomize && (
								<div className={css`
						padding: 16px;
						line-height: 2em;
						background: #FAEADF;
						font-weight: 500;
						color: #CB5301;
						border-radius: 8px;
						border: 1px solid #CB5301;
					`}
								>
									{__('Please note that randomization doesn\'t work in the preview mode!', 'quillforms')}
								</div>
							)}
						</>
					</BaseControl>
				)
			}
		</div>
	);
};
export default DefaultControls;
