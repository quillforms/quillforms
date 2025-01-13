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
	RangeControl,
	FocalPointPicker,
} from '@wordpress/components';
import { MediaUpload } from '@wordpress/media-utils';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { forEach, isEmpty, size } from 'lodash';
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import ColorPicker from '../color-picker';
import ComboColorPicker from '../combo-color-picker';
import ColorPreview from '../color-preview';
import CustomizeFooter from '../customize-footer';
import TypographyPanel from '../typography-panel';

const CustomizeThemePanel = () => {
	const { setCurrentThemeProperties, setCurrentThemeTitle } = useDispatch(
		'quillForms/theme-editor'
	);
	const { theme, shouldBeSaved, currentThemeId, customFontsList } = useSelect((select) => {
		return {
			shouldBeSaved: select(
				'quillForms/theme-editor'
			).shouldThemeBeSaved(),
			currentThemeId: select(
				'quillForms/theme-editor'
			).getCurrentThemeId(),
			theme: select('quillForms/theme-editor').getCurrentTheme(),
			customFontsList: select('quillForms/custom-fonts')?.getFontsList() ?? [],
		};
	});

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
	const { setCurrentTab } = useDispatch('quillForms/theme-editor');
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
		buttonsFontColor,
		questionsLabelFont,
		questionsDescriptionFont,
		buttonsBgColor,
		formFooterBgColor,
		errorsFontColor,
		errorsBgColor,
		progressBarBgColor,
		progressBarFillColor,
	} = $properties;
	return (
		<div className="theme-editor-customize">
			<div
				className="theme-editor-customize__back"
				onClick={() => {
					setCurrentTab('themes-list');
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
				>
					<path
						fill="none"
						d="M0 0h24v24H0z"
					/>
					<path
						d="M10 17l5-5-5-5v10z"
					/>
				</svg>
				<span>{__('Back', 'quillforms')}</span>
			</div>
			<PanelBody title={__('Theme Title', 'quillforms')} initialOpen={false}>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label={__('Title', 'quillforms')} />
						<TextControl
							value={title}
							onChange={(val) => {
								setCurrentThemeTitle(val);
							}}
						/>
					</ControlWrapper>
				</BaseControl>
			</PanelBody>
			<PanelBody title={__('Background and Logo', 'quillforms')} initialOpen={false}>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label={__('Background Overlay Color', 'quillforms')} />
						<ColorPreview color={backgroundColor} />
					</ControlWrapper>
					<ComboColorPicker
						color={backgroundColor}
						setColor={(value) => {
							setCurrentThemeProperties({
								backgroundColor: value,
							});
						}}
					/>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label={__('Background Image', 'quillforms')} />
						{isEmpty(backgroundImage) ? (
							<MediaUpload
								onSelect={(media) =>
									setCurrentThemeProperties({
										backgroundImage: media.url,
									})
								}
								allowedTypes={['image']}
								render={({ open }) => (
									<Button isSmall onClick={open}>
										{__('Add', 'quillforms')}
									</Button>
								)}
							/>
						) : (
							<Button
								isDanger
								isSmall
								onClick={() =>
									setCurrentThemeProperties({
										backgroundImage: '',
									})
								}
							>
								{__('Remove', 'quillforms')}
							</Button>
						)}
					</ControlWrapper>
					<div className={
						css`
						margin-top: 10px;
						padding: 10px;
						background: #5a5a5a;
						color: #fff;
						border-radius: 5px;
					`

					}>
						<p>
							{__('To add a background image, clear the background overlay color or add opacity to it.', 'quillforms')}
						</p>
					</div>
				</BaseControl>

				{!isEmpty(backgroundImage) && (
					<div
						className={css`
							max-width: 300px;
						` }
					>
						<BaseControl>
							<ControlWrapper orientation="vertical">
								<ControlLabel label={__('Focal Point Picker', 'quillforms')}></ControlLabel>
								<div
									className={css`
										max-width: 300px;
									` }
								>
									<FocalPointPicker
										url={backgroundImage}
										value={backgroundImageFocalPoint}
										onDragStart={(val) => {
											setCurrentThemeProperties({
												backgroundImageFocalPoint: val,
											});
										}}
										onDrag={(val) => {
											setCurrentThemeProperties({
												backgroundImageFocalPoint: val,
											});
										}}
										onChange={(val) => {
											setCurrentThemeProperties({
												backgroundImageFocalPoint: val,
											});
										}}
									/>
								</div>
							</ControlWrapper>
						</BaseControl>
					</div>
				)}
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label={__('logo', 'quillforms')} />
						{isEmpty(logo) ? (
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
									<Button isSmall onClick={open}>
										{__('Add', 'quillforms')}
									</Button>
								)}
							/>
						) : (
							<Button
								isDanger
								isSmall
								onClick={() =>
									setCurrentThemeProperties({
										logo: {},
									})
								}
							>
								{__('Remove', 'quillforms')}
							</Button>
						)}
					</ControlWrapper>
				</BaseControl>
			</PanelBody>

			<PanelBody title={__('Font Families', 'quillforms')} initialOpen={false}>
				<div className="fonts-hint">
					<p>
						{__('You can add your custom font from settings icon at left bar and then click on custom fonts.', 'quillforms')}
					</p>
				</div>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label={__('Base Font', 'quillforms')} />
						<FontPicker
							fonts={allFonts}
							selectedFont={font}
							setFont={(value) => {
								setCurrentThemeProperties({
									font: value,
								});
							}}
						/>
					</ControlWrapper>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel
							label={__('Questions Label Font', 'quillforms')}
						/>
						<FontPicker
							fonts={{
								Inherit: 'inherit',
								...customFonts,
								...configApi.getFonts(),
							}}
							selectedFont={questionsLabelFont}
							setFont={(value) => {
								setCurrentThemeProperties({
									questionsLabelFont: value,
								});
							}}
						/>
					</ControlWrapper>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel
							label={__('Questions Description Font', 'quillforms')}
						/>
						<FontPicker
							fonts={{
								Inherit: 'inherit',
								...customFonts,
								...configApi.getFonts(),
							}}
							selectedFont={questionsDescriptionFont}
							setFont={(value) => {
								setCurrentThemeProperties({
									questionsDescriptionFont: value,
								});
							}}
						/>
					</ControlWrapper>
				</BaseControl>
			</PanelBody>

			<PanelBody title={__('Colors', 'quillforms')} initialOpen={false}>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label={__('Questions Color', 'quillforms')} />
						<ColorPreview color={questionsColor} />
					</ControlWrapper>
					<ColorPicker
						value={questionsColor}
						onChange={(value) => {
							setCurrentThemeProperties({
								questionsColor: value,
							});
						}}
					/>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label={__('Answers Color', 'quillforms')} />
						<ColorPreview color={answersColor} />
					</ControlWrapper>
					<ColorPicker
						value={answersColor}
						onChange={(value) => {
							setCurrentThemeProperties({
								answersColor: value,
							});
						}}
					/>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label={__('Buttons Font Color', 'quillforms')} />
						<ColorPreview color={buttonsFontColor} />
					</ControlWrapper>
					<ColorPicker
						value={buttonsFontColor}
						onChange={(value) => {
							setCurrentThemeProperties({
								buttonsFontColor: value,
							});
						}}
					/>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label={__('Buttons Background Color', 'quillforms')} />
						<ColorPreview color={buttonsBgColor} />
					</ControlWrapper>
					<ComboColorPicker
						color={buttonsBgColor}
						setColor={(value) => {
							setCurrentThemeProperties({
								buttonsBgColor: value,
							});
						}}
					/>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label={__('Errors Text Color', 'quillforms')} />
						<ColorPreview color={errorsFontColor} />
					</ControlWrapper>
					<ColorPicker
						value={errorsFontColor}
						onChange={(value) => {
							setCurrentThemeProperties({
								errorsFontColor: value,
							});
						}}
					/>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label={__('Errors Background Color', 'quillforms')} />
						<ColorPreview color={errorsBgColor} />
					</ControlWrapper>
					<ComboColorPicker
						color={errorsBgColor}
						setColor={(value) => {
							setCurrentThemeProperties({
								errorsBgColor: value,
							});
						}}
					/>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="vertical">
						<ControlLabel
							label={__('Form Footer Background Color', 'quillforms')}
							isNew={true}
						/>
						<ResponsiveControl
							desktopChildren={
								<ComboColorPicker
									color={formFooterBgColor.lg}
									setColor={(value) => {
										setCurrentThemeProperties({
											formFooterBgColor: {
												...formFooterBgColor,
												lg: value,
											},
										});
									}}
								/>
							}
							tabletChildren={
								<ComboColorPicker
									color={formFooterBgColor.md}
									setColor={(value) => {
										setCurrentThemeProperties({
											formFooterBgColor: {
												...formFooterBgColor,
												md: value,
											},
										});
									}}
								/>
							}
							mobileChildren={
								<ComboColorPicker
									color={formFooterBgColor.sm}
									setColor={(value) => {
										setCurrentThemeProperties({
											formFooterBgColor: {
												...formFooterBgColor,
												sm: value,
											},
										});
									}}
								/>
							}
						/>
					</ControlWrapper>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label={__('Progress Bar Fill Color', 'quillforms')} />
						<ColorPreview color={progressBarFillColor} />
					</ControlWrapper>
					<ColorPicker
						value={progressBarFillColor}
						onChange={(value) => {
							setCurrentThemeProperties({
								progressBarFillColor: value,
							});
						}}
					/>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label={__('Progress Bar Background Color', 'quillforms')} />
						<ColorPreview color={progressBarBgColor} />
					</ControlWrapper>
					<ColorPicker
						value={progressBarBgColor}
						onChange={(value) => {
							setCurrentThemeProperties({
								progressBarBgColor: value,
							});
						}}
					/>
				</BaseControl>
			</PanelBody>

			<TypographyPanel
				properties={$properties}
				setCurrentThemeProperties={setCurrentThemeProperties}
			/>
			<PanelBody title={__('Borders', 'quillforms')} initialOpen={false}>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label={__('Buttons Border Radius(px)', 'quillforms')} />
						<RangeControl
							className={css`
								width: 30%;
							` }
							value={buttonsBorderRadius}
							onChange={(value) =>
								setCurrentThemeProperties({
									buttonsBorderRadius: value,
								})
							}
							min={1}
							max={30}
						/>
					</ControlWrapper>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel
							label={__('Buttons Border Width(px)', 'quillforms')}
							isNew={true}
						/>
						<RangeControl
							className={css`
								width: 30%;
							` }
							value={buttonsBorderWidth}
							onChange={(value) =>
								setCurrentThemeProperties({
									buttonsBorderWidth: value,
								})
							}
							min={0}
							max={10}
						/>
					</ControlWrapper>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel
							label={__('Buttons Border Color', 'quillforms')}
							isNew={true}
						/>
						<ColorPicker
							value={buttonsBorderColor}
							onChange={(value) => {
								setCurrentThemeProperties({
									buttonsBorderColor: value,
								});
							}}
						/>
					</ControlWrapper>
				</BaseControl>
			</PanelBody>
			{shouldBeSaved && (
				<CustomizeFooter
					themeTitle={title}
					themeProperties={theme.properties}
					themeId={currentThemeId}
				/>
			)}
		</div>
	);
};
export default CustomizeThemePanel;
