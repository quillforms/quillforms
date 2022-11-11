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
import { isEmpty } from 'lodash';
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import ColorPicker from '../color-picker';
import ComboColorPicker from '../combo-color-picker';
import ColorPreview from '../color-preview';
import CustomizeFooter from '../customize-footer';
import MeasureControl from '../measure-control';

const CustomizeThemePanel = () => {
	const { setCurrentThemeProperties, setCurrentThemeTitle } = useDispatch(
		'quillForms/theme-editor'
	);
	const { theme, shouldBeSaved, currentThemeId } = useSelect( ( select ) => {
		return {
			shouldBeSaved: select(
				'quillForms/theme-editor'
			).shouldThemeBeSaved(),
			currentThemeId: select(
				'quillForms/theme-editor'
			).getCurrentThemeId(),
			theme: select( 'quillForms/theme-editor' ).getCurrentTheme(),
		};
	} );

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
		questionsLabelFont,
		questionsLabelFontSize,
		questionsLabelLineHeight,
		questionsDescriptionFont,
		questionsDescriptionFontSize,
		questionsDescriptionLineHeight,
		questionsColor,
		answersColor,
		buttonsFontColor,
		buttonsFontSize,
		buttonsPadding,
		buttonsBgColor,
		buttonsBorderRadius,
		buttonsBorderWidth,
		buttonsBorderColor,
		formFooterBgColor,
		errorsFontColor,
		errorsBgColor,
		progressBarBgColor,
		progressBarFillColor,
	} = $properties;
	return (
		<div className="theme-editor-customize">
			<PanelBody title="General Settings" initialOpen={ false }>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label="Title" />
						<TextControl
							value={ title }
							onChange={ ( val ) => {
								setCurrentThemeTitle( val );
							} }
						/>
					</ControlWrapper>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label="General Font" />
						<FontPicker
							fonts={ configApi.getFonts() }
							selectedFont={ font }
							setFont={ ( value ) => {
								setCurrentThemeProperties( {
									font: value,
								} );
							} }
						/>
					</ControlWrapper>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label="Background" />
						<ColorPreview color={ backgroundColor } />
					</ControlWrapper>
					<ComboColorPicker
						color={ backgroundColor }
						setColor={ ( value ) => {
							setCurrentThemeProperties( {
								backgroundColor: value,
							} );
						} }
					/>
				</BaseControl>

				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label="Background Image" />
						{ isEmpty( backgroundImage ) ? (
							<MediaUpload
								onSelect={ ( media ) =>
									setCurrentThemeProperties( {
										backgroundImage: media.url,
									} )
								}
								allowedTypes={ [ 'image' ] }
								render={ ( { open } ) => (
									<Button isSmall onClick={ open }>
										Add
									</Button>
								) }
							/>
						) : (
							<Button
								isDanger
								isSmall
								onClick={ () =>
									setCurrentThemeProperties( {
										backgroundImage: '',
									} )
								}
							>
								Remove
							</Button>
						) }
					</ControlWrapper>
				</BaseControl>
				{ ! isEmpty( backgroundImage ) && (
					<div
						className={ css`
							max-width: 300px;
						` }
					>
						<BaseControl>
							<ControlWrapper orientation="vertical">
								<ControlLabel label="Focal Point Picker"></ControlLabel>
								<div
									className={ css`
										max-width: 300px;
									` }
								>
									<FocalPointPicker
										url={ backgroundImage }
										value={ backgroundImageFocalPoint }
										onDragStart={ ( val ) => {
											setCurrentThemeProperties( {
												backgroundImageFocalPoint: val,
											} );
										} }
										onDrag={ ( val ) => {
											setCurrentThemeProperties( {
												backgroundImageFocalPoint: val,
											} );
										} }
										onChange={ ( val ) => {
											setCurrentThemeProperties( {
												backgroundImageFocalPoint: val,
											} );
										} }
									/>
								</div>
							</ControlWrapper>
						</BaseControl>
					</div>
				) }
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label="logo" />
						{ isEmpty( logo ) ? (
							<MediaUpload
								onSelect={ ( media ) =>
									setCurrentThemeProperties( {
										logo: {
											type: 'image',
											src: media.url,
										},
									} )
								}
								allowedTypes={ [ 'image' ] }
								render={ ( { open } ) => (
									<Button isSmall onClick={ open }>
										Add
									</Button>
								) }
							/>
						) : (
							<Button
								isDanger
								isSmall
								onClick={ () =>
									setCurrentThemeProperties( {
										logo: {},
									} )
								}
							>
								Remove
							</Button>
						) }
					</ControlWrapper>
				</BaseControl>
			</PanelBody>
			<PanelBody title="Questions Settings" initialOpen={ false }>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel
							label="Questions Label Font"
							isNew={ true }
						/>
						<FontPicker
							fonts={ {
								Inherit: 'inherit',
								...configApi.getFonts(),
							} }
							selectedFont={ questionsLabelFont }
							setFont={ ( value ) => {
								setCurrentThemeProperties( {
									questionsLabelFont: value,
								} );
							} }
						/>
					</ControlWrapper>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel
							label="Questions Label Font Size(px)"
							isNew={ true }
						/>
						<ResponsiveControl
							desktopChildren={
								<MeasureControl
									val={ parseInt(
										questionsLabelFontSize.lg.replace(
											'px',
											''
										)
									) }
									onChange={ ( val ) => {
										setCurrentThemeProperties( {
											questionsLabelFontSize: {
												...questionsLabelFontSize,
												lg: `${ val }px`,
											},
										} );
									} }
								/>
							}
							tabletChildren={
								<MeasureControl
									val={ parseInt(
										questionsLabelFontSize.md.replace(
											'px',
											''
										)
									) }
									onChange={ ( val ) => {
										setCurrentThemeProperties( {
											questionsLabelFontSize: {
												...questionsLabelFontSize,
												md: `${ val }px`,
											},
										} );
									} }
								/>
							}
							mobileChildren={
								<MeasureControl
									val={ parseInt(
										questionsLabelFontSize.sm.replace(
											'px',
											''
										)
									) }
									onChange={ ( val ) => {
										setCurrentThemeProperties( {
											questionsLabelFontSize: {
												...questionsLabelFontSize,
												sm: `${ val }px`,
											},
										} );
									} }
								/>
							}
						/>
					</ControlWrapper>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel
							label="Questions Label Line Height(px)"
							isNew={ true }
						/>
						<ResponsiveControl
							desktopChildren={
								<MeasureControl
									val={ parseInt(
										questionsLabelLineHeight.lg.replace(
											'px',
											''
										)
									) }
									onChange={ ( val ) => {
										setCurrentThemeProperties( {
											questionsLabelLineHeight: {
												...questionsLabelLineHeight,
												lg: `${ val }px`,
											},
										} );
									} }
								/>
							}
							tabletChildren={
								<MeasureControl
									val={ parseInt(
										questionsLabelLineHeight.md.replace(
											'px',
											''
										)
									) }
									onChange={ ( val ) => {
										setCurrentThemeProperties( {
											questionsLabelLineHeight: {
												...questionsLabelLineHeight,
												md: `${ val }px`,
											},
										} );
									} }
								/>
							}
							mobileChildren={
								<MeasureControl
									val={ parseInt(
										questionsLabelLineHeight.sm.replace(
											'px',
											''
										)
									) }
									onChange={ ( val ) => {
										setCurrentThemeProperties( {
											questionsLabelLineHeight: {
												...questionsLabelLineHeight,
												sm: `${ val }px`,
											},
										} );
									} }
								/>
							}
						/>
					</ControlWrapper>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel
							label="Questions Description Font"
							isNew={ true }
						/>
						<FontPicker
							fonts={ {
								Inherit: 'inherit',
								...configApi.getFonts(),
							} }
							selectedFont={ questionsDescriptionFont }
							setFont={ ( value ) => {
								setCurrentThemeProperties( {
									questionsDescriptionFont: value,
								} );
							} }
						/>
					</ControlWrapper>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel
							label="Questions Description Font Size(px)"
							isNew={ true }
						/>
						<ResponsiveControl
							desktopChildren={
								<MeasureControl
									val={ parseInt(
										questionsDescriptionFontSize.lg.replace(
											'px',
											''
										)
									) }
									onChange={ ( val ) => {
										setCurrentThemeProperties( {
											questionsDescriptionFontSize: {
												...questionsDescriptionFontSize,
												lg: `${ val }px`,
											},
										} );
									} }
								/>
							}
							tabletChildren={
								<MeasureControl
									val={ parseInt(
										questionsDescriptionFontSize.md.replace(
											'px',
											''
										)
									) }
									onChange={ ( val ) => {
										setCurrentThemeProperties( {
											questionsDescriptionFontSize: {
												...questionsDescriptionFontSize,
												md: `${ val }px`,
											},
										} );
									} }
								/>
							}
							mobileChildren={
								<MeasureControl
									val={ parseInt(
										questionsDescriptionFontSize.sm.replace(
											'px',
											''
										)
									) }
									onChange={ ( val ) => {
										setCurrentThemeProperties( {
											questionsDescriptionFontSize: {
												...questionsDescriptionFontSize,
												sm: `${ val }px`,
											},
										} );
									} }
								/>
							}
						/>
					</ControlWrapper>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel
							label="Questions Description Line Height(px)"
							isNew={ true }
						/>
						<ResponsiveControl
							desktopChildren={
								<MeasureControl
									val={ parseInt(
										questionsDescriptionLineHeight.lg.replace(
											'px',
											''
										)
									) }
									onChange={ ( val ) => {
										setCurrentThemeProperties( {
											questionsDescriptionLineHeight: {
												...questionsDescriptionLineHeight,
												lg: `${ val }px`,
											},
										} );
									} }
								/>
							}
							tabletChildren={
								<MeasureControl
									val={ parseInt(
										questionsDescriptionLineHeight.md.replace(
											'px',
											''
										)
									) }
									onChange={ ( val ) => {
										setCurrentThemeProperties( {
											questionsDescriptionLineHeight: {
												...questionsDescriptionLineHeight,
												md: `${ val }px`,
											},
										} );
									} }
								/>
							}
							mobileChildren={
								<MeasureControl
									val={ parseInt(
										questionsDescriptionLineHeight.sm.replace(
											'px',
											''
										)
									) }
									onChange={ ( val ) => {
										setCurrentThemeProperties( {
											questionsDescriptionLineHeight: {
												...questionsDescriptionLineHeight,
												sm: `${ val }px`,
											},
										} );
									} }
								/>
							}
						/>
					</ControlWrapper>
				</BaseControl>

				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label="Questions Color" />
						<ColorPreview color={ questionsColor } />
					</ControlWrapper>
					<ColorPicker
						value={ questionsColor }
						onChange={ ( value ) => {
							setCurrentThemeProperties( {
								questionsColor: value,
							} );
						} }
					/>
				</BaseControl>
			</PanelBody>
			<PanelBody title="Answers Settings" initialOpen={ false }>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label="Answers Color" />
						<ColorPreview color={ answersColor } />
					</ControlWrapper>
					<ColorPicker
						value={ answersColor }
						onChange={ ( value ) => {
							setCurrentThemeProperties( {
								answersColor: value,
							} );
						} }
					/>
				</BaseControl>
			</PanelBody>
			<PanelBody title="Buttons Settings" initialOpen={ false }>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label="Text Color" />
						<ColorPreview color={ buttonsFontColor } />
					</ControlWrapper>
					<ColorPicker
						value={ buttonsFontColor }
						onChange={ ( value ) => {
							setCurrentThemeProperties( {
								buttonsFontColor: value,
							} );
						} }
					/>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label="Background Color" />
						<ColorPreview color={ buttonsBgColor } />
					</ControlWrapper>
					<ComboColorPicker
						color={ buttonsBgColor }
						setColor={ ( value ) => {
							setCurrentThemeProperties( {
								buttonsBgColor: value,
							} );
						} }
					/>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel
							label="Buttons Font Size(px)"
							isNew={ true }
						/>
						<ResponsiveControl
							desktopChildren={
								<MeasureControl
									val={ parseInt(
										buttonsFontSize.lg.replace( 'px', '' )
									) }
									onChange={ ( val ) => {
										setCurrentThemeProperties( {
											buttonsFontSize: {
												...buttonsFontSize,
												lg: `${ val }px`,
											},
										} );
									} }
								/>
							}
							tabletChildren={
								<MeasureControl
									val={ parseInt(
										buttonsFontSize.md.replace( 'px', '' )
									) }
									onChange={ ( val ) => {
										setCurrentThemeProperties( {
											buttonsFontSize: {
												...buttonsFontSize,
												md: `${ val }px`,
											},
										} );
									} }
								/>
							}
							mobileChildren={
								<MeasureControl
									val={ parseInt(
										buttonsFontSize.sm.replace( 'px', '' )
									) }
									onChange={ ( val ) => {
										setCurrentThemeProperties( {
											buttonsFontSize: {
												...buttonsFontSize,
												sm: `${ val }px`,
											},
										} );
									} }
								/>
							}
						/>
					</ControlWrapper>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="vertical">
						<ControlLabel
							label="Buttons Padding(px)"
							isNew={ true }
						/>
						<ResponsiveControl
							desktopChildren={
								<div
									className={ css`
										display: flex;
										align-items: center;
										div {
											text-align: center;
										}
										input {
											width: 60px !important;
										}
									` }
								>
									<TextControl
										label={ 'Top' }
										type="number"
										value={ parseInt(
											buttonsPadding.top.lg.replace(
												'px',
												''
											)
										) }
										onChange={ ( val ) => {
											setCurrentThemeProperties( {
												buttonsPadding: {
													...buttonsPadding,
													top: {
														...buttonsPadding.top,
														lg: `${ val }px`,
													},
												},
											} );
										} }
									/>
									<TextControl
										label={ 'Right' }
										type="number"
										value={ parseInt(
											buttonsPadding.right.lg.replace(
												'px',
												''
											)
										) }
										onChange={ ( val ) => {
											setCurrentThemeProperties( {
												buttonsPadding: {
													...buttonsPadding,
													right: {
														...buttonsPadding.right,
														lg: `${ val }px`,
													},
												},
											} );
										} }
									/>
									<TextControl
										label={ 'Bottom' }
										type="number"
										value={ parseInt(
											buttonsPadding.bottom.lg.replace(
												'px',
												''
											)
										) }
										onChange={ ( val ) => {
											setCurrentThemeProperties( {
												buttonsPadding: {
													...buttonsPadding,
													bottom: {
														...buttonsPadding.bottom,
														lg: `${ val }px`,
													},
												},
											} );
										} }
									/>
									<TextControl
										label={ 'Left' }
										type="number"
										value={ parseInt(
											buttonsPadding.left.lg.replace(
												'px',
												''
											)
										) }
										onChange={ ( val ) => {
											setCurrentThemeProperties( {
												buttonsPadding: {
													...buttonsPadding,
													left: {
														...buttonsPadding.left,
														lg: `${ val }px`,
													},
												},
											} );
										} }
									/>
								</div>
							}
							tabletChildren={
								<div
									className={ css`
										display: flex;
										align-items: center;
										div {
											text-align: center;
										}
										input {
											width: 60px !important;
										}
									` }
								>
									<TextControl
										label={ 'Top' }
										type="number"
										value={ parseInt(
											buttonsPadding.top.md.replace(
												'px',
												''
											)
										) }
										onChange={ ( val ) => {
											setCurrentThemeProperties( {
												buttonsPadding: {
													...buttonsPadding,
													top: {
														...buttonsPadding.top,
														md: `${ val }px`,
													},
												},
											} );
										} }
									/>
									<TextControl
										label={ 'Right' }
										type="number"
										value={ parseInt(
											buttonsPadding.right.md.replace(
												'px',
												''
											)
										) }
										onChange={ ( val ) => {
											setCurrentThemeProperties( {
												buttonsPadding: {
													...buttonsPadding,
													right: {
														...buttonsPadding.right,
														md: `${ val }px`,
													},
												},
											} );
										} }
									/>
									<TextControl
										label={ 'Bottom' }
										type="number"
										value={ parseInt(
											buttonsPadding.bottom.md.replace(
												'px',
												''
											)
										) }
										onChange={ ( val ) => {
											setCurrentThemeProperties( {
												buttonsPadding: {
													...buttonsPadding,
													bottom: {
														...buttonsPadding.bottom,
														md: `${ val }px`,
													},
												},
											} );
										} }
									/>
									<TextControl
										label={ 'Left' }
										type="number"
										value={ parseInt(
											buttonsPadding.left.md.replace(
												'px',
												''
											)
										) }
										onChange={ ( val ) => {
											setCurrentThemeProperties( {
												buttonsPadding: {
													...buttonsPadding,
													left: {
														...buttonsPadding.left,
														md: `${ val }px`,
													},
												},
											} );
										} }
									/>
								</div>
							}
							mobileChildren={
								<div
									className={ css`
										display: flex;
										align-items: center;
										div {
											text-align: center;
										}
										input {
											width: 60px !important;
										}
									` }
								>
									<TextControl
										label={ 'Top' }
										type="number"
										value={ parseInt(
											buttonsPadding.top.sm.replace(
												'px',
												''
											)
										) }
										onChange={ ( val ) => {
											setCurrentThemeProperties( {
												buttonsPadding: {
													...buttonsPadding,
													top: {
														...buttonsPadding.top,
														sm: `${ val }px`,
													},
												},
											} );
										} }
									/>
									<TextControl
										label={ 'Right' }
										type="number"
										value={ parseInt(
											buttonsPadding.right.sm.replace(
												'px',
												''
											)
										) }
										onChange={ ( val ) => {
											setCurrentThemeProperties( {
												buttonsPadding: {
													...buttonsPadding,
													right: {
														...buttonsPadding.right,
														sm: `${ val }px`,
													},
												},
											} );
										} }
									/>
									<TextControl
										label={ 'Bottom' }
										type="number"
										value={ parseInt(
											buttonsPadding.bottom.sm.replace(
												'px',
												''
											)
										) }
										onChange={ ( val ) => {
											setCurrentThemeProperties( {
												buttonsPadding: {
													...buttonsPadding,
													bottom: {
														...buttonsPadding.bottom,
														sm: `${ val }px`,
													},
												},
											} );
										} }
									/>
									<TextControl
										label={ 'Left' }
										type="number"
										value={ parseInt(
											buttonsPadding.left.sm.replace(
												'px',
												''
											)
										) }
										onChange={ ( val ) => {
											setCurrentThemeProperties( {
												buttonsPadding: {
													...buttonsPadding,
													left: {
														...buttonsPadding.left,
														sm: `${ val }px`,
													},
												},
											} );
										} }
									/>
								</div>
							}
						/>
					</ControlWrapper>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label="Border Radius(px)" />
						<RangeControl
							className={ css`
								width: 30%;
							` }
							value={ buttonsBorderRadius }
							onChange={ ( value ) =>
								setCurrentThemeProperties( {
									buttonsBorderRadius: value,
								} )
							}
							min={ 1 }
							max={ 30 }
						/>
					</ControlWrapper>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label="Border Width(px)" isNew={ true } />
						<RangeControl
							className={ css`
								width: 30%;
							` }
							value={ buttonsBorderWidth }
							onChange={ ( value ) =>
								setCurrentThemeProperties( {
									buttonsBorderWidth: value,
								} )
							}
							min={ 0 }
							max={ 10 }
						/>
					</ControlWrapper>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label="Border Color" isNew={ true } />
						<ColorPicker
							value={ buttonsBorderColor }
							onChange={ ( value ) => {
								setCurrentThemeProperties( {
									buttonsBorderColor: value,
								} );
							} }
						/>
					</ControlWrapper>
				</BaseControl>
			</PanelBody>
			<PanelBody title="Error Messages Settings" initialOpen={ false }>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label="Text Color" />
						<ColorPreview color={ errorsFontColor } />
					</ControlWrapper>
					<ColorPicker
						value={ errorsFontColor }
						onChange={ ( value ) => {
							setCurrentThemeProperties( {
								errorsFontColor: value,
							} );
						} }
					/>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label="Background Color" />
						<ColorPreview color={ errorsBgColor } />
					</ControlWrapper>
					<ComboColorPicker
						color={ errorsBgColor }
						setColor={ ( value ) => {
							setCurrentThemeProperties( {
								errorsBgColor: value,
							} );
						} }
					/>
				</BaseControl>
			</PanelBody>
			<PanelBody title="Form Footer Settings" initialOpen={ false }>
				<BaseControl>
					<ControlWrapper orientation="vertical">
						<ControlLabel
							label="Form Footer Background Color"
							isNew={ true }
						/>
						<ResponsiveControl
							desktopChildren={
								<ComboColorPicker
									color={ formFooterBgColor.lg }
									setColor={ ( value ) => {
										setCurrentThemeProperties( {
											formFooterBgColor: {
												...formFooterBgColor,
												lg: value,
											},
										} );
									} }
								/>
							}
							tabletChildren={
								<ComboColorPicker
									color={ formFooterBgColor.md }
									setColor={ ( value ) => {
										setCurrentThemeProperties( {
											formFooterBgColor: {
												...formFooterBgColor,
												md: value,
											},
										} );
									} }
								/>
							}
							mobileChildren={
								<ComboColorPicker
									color={ formFooterBgColor.sm }
									setColor={ ( value ) => {
										setCurrentThemeProperties( {
											formFooterBgColor: {
												...formFooterBgColor,
												sm: value,
											},
										} );
									} }
								/>
							}
						/>
					</ControlWrapper>
				</BaseControl>
			</PanelBody>
			<PanelBody title="Progress Bar Settings" initialOpen={ false }>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label="Progress Bar Fill Color" />
						<ColorPreview color={ progressBarFillColor } />
					</ControlWrapper>
					<ColorPicker
						value={ progressBarFillColor }
						onChange={ ( value ) => {
							setCurrentThemeProperties( {
								progressBarFillColor: value,
							} );
						} }
					/>
				</BaseControl>
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label="Progress Bar Background Color" />
						<ColorPreview color={ progressBarBgColor } />
					</ControlWrapper>
					<ColorPicker
						value={ progressBarBgColor }
						onChange={ ( value ) => {
							setCurrentThemeProperties( {
								progressBarBgColor: value,
							} );
						} }
					/>
				</BaseControl>
			</PanelBody>
			{ shouldBeSaved && (
				<CustomizeFooter
					themeTitle={ title }
					themeProperties={ theme.properties }
					themeId={ currentThemeId }
				/>
			) }
		</div>
	);
};
export default CustomizeThemePanel;
