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
} from '@quillforms/admin-components';
import configApi from '@quillforms/config';
import { getDefaultThemeProperties } from '@quillforms/utils';

/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { PanelBody, RangeControl } from '@wordpress/components';
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
		logo,
		font,
		questionsColor,
		answersColor,
		buttonsFontColor,
		buttonsBgColor,
		buttonsBorderRadius,
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
						<ControlLabel label="Font" />
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
						<ControlLabel label="Color" />
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
						<ControlLabel label="Color" />
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
