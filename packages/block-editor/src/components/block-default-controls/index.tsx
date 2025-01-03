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
	SelectControl,
} from '@quillforms/admin-components';

// @ts-expect-error
import { ThemeCard, ThemeListItem } from '@quillforms/theme-editor';
import type { BlockAttributes, FormBlock } from '@quillforms/types';

/**
 * WordPress Dependencies
 */
import { FocalPointPicker, RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { Fragment } from 'react';
import { MediaUpload } from '@wordpress/media-utils';

/**
 * External Dependencies
 */
import { isEmpty } from 'lodash';
import { css } from 'emotion';
/**
 * Internal Dependencies
 */
import BlockThemeControl from '../block-theme';
import CustomHTML from '../block-custom-html';
import BlockLayout from '../block-layout';
import BorderRadiusTemplates from '../border-radius-templates';


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
	} = useSelect((select) => {
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
		{ key: '100%', name: '100%' },
		{ key: '50%', name: '50%' },
		{ key: '33%', name: '33%' },
	]
	return (
		<Fragment>
			{editableSupport && requiredSupport && (
				<BaseControl>
					<ControlWrapper>
						<ControlLabel label={'Required'} />
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
						<ControlWrapper>
							<ControlLabel label={'Image'} />
							{isEmpty(attachment) ? (
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
											className="media-upload-btn"
											onClick={open}
										>
											Add
										</button>
									)}
								/>
							) : (
								<button
									className="remove-media-btn"
									onClick={() =>
										setAttributes({
											attachment: {},
										})
									}
									color="secondary"
								>
									Remove
								</button>
							)}
						</ControlWrapper>
					</BaseControl>
					<BaseControl>
						<ControlWrapper orientation="vertical">
							<ControlLabel label="Layout"></ControlLabel>
							<BlockLayout
								layout={attributes?.layout}
								setAttributes={setAttributes}
							/>
						</ControlWrapper>
					</BaseControl>

					{(attributes?.layout === 'split-left' ||
						attributes?.layout === 'split-right') &&
						attributes?.attachment?.url && (
							<BaseControl>
								<ControlWrapper orientation="vertical">
									<ControlLabel label="Focal Point Picker"></ControlLabel>
									<div
										className={css`
											max-width: 300px;
										` }
									>
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
										<ControlLabel label="Set Maximum Width for attachment" />
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
													<ControlLabel label="Maximum Width(px)" />
													<RangeControl
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
								<BaseControl>
									<ControlWrapper orientation="horizontal">
										<ControlLabel label="Use Fancy Border Radius"></ControlLabel>
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
											<ControlLabel label="Choose your favorite fancy border radius"></ControlLabel>
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
							</>
						)}
				</>
			)}
			{defaultValueSupport && (
				<BaseControl>
					<ControlWrapper orientation="vertical">
						<ControlLabel label="Default Value" />
						<div
							className={css`
								.combobox-control-rich-text-back {
									display: none;
								}
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
						<ControlLabel label={'Width'} isNew />
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
					<ControlWrapper>
						<ControlLabel
							label={'Override default placeholder'}
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
					<>
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
					</>
				</BaseControl>
			)}
			{!isChild && (
				<>
					<BaseControl>
						<ControlWrapper orientation="vertical">
							<ControlLabel label={'Custom HTML'} />
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
							<ControlLabel label="Randomize"></ControlLabel>
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
						margin-top: 3px;
						padding: 9px;
						line-height: 2em;
						background: #fff2cd;
						font-weight: 500;
						color: #c0945d;
					`}
								>
									Please note that randomization doesn't work in the preview mode!
								</div>
							)}
						</>
					</BaseControl>
				)
			}
		</Fragment>
	);
};
export default DefaultControls;
