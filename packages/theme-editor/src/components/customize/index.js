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
				<span>Back</span>

			</div>
			<PanelBody title="Theme Title" initialOpen={false}>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label="Title" />
						<TextControl
							value={title}
							onChange={(val) => {
								setCurrentThemeTitle(val);
							}}
						/>
					</ControlWrapper>
				</BaseControl>
			</PanelBody>
			<PanelBody title="Background and Logo" initialOpen={false}>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label="Background Overlay Color" />
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
						<ControlLabel label="Background Image" />
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
										Add
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
								Remove
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
							To add a background image, clear the background overlay color or add opacity to it.
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
								<ControlLabel label="Focal Point Picker"></ControlLabel>
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
						<ControlLabel label="logo" />
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
										Add
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
								Remove
							</Button>
						)}
					</ControlWrapper>
				</BaseControl>
			</PanelBody>

			<PanelBody title="Font Families" initialOpen={false}>
				<div className="fonts-hint">
					<p>
						Now, you can add your custom font from settings icon at left bar and then click on custom fonts.
					</p>
				</div>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label="Base Font" />
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
							label="Questions Label Font"
							isNew={true}
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
							label="Questions Description Font"
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

			<PanelBody title="Colors" initialOpen={false}>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label="Questions Color" />
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
						<ControlLabel label="Answers Color" />
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
						<ControlLabel label="Buttons Font Color" />
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
						<ControlLabel label="Buttons Background Color" />
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
						<ControlLabel label="Erros Text Color" />
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
						<ControlLabel label="Errros Background Color" />
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
							label="Form Footer Background Color"
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
						<ControlLabel label="Progress Bar Fill Color" />
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
						<ControlLabel label="Progress Bar Background Color" />
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
			<PanelBody title="Borders" initialOpen={false}>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label="Buttons Border Radius(px)" />
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
							label="Buttons Border Width(px)"
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
							label="Buttons Border Color"
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
