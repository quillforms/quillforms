/**
 * QuillForms Dependencies
 */
import {
	__experimentalBaseControl,
	__experimentalControlWrapper,
	__experimentalControlLabel,
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
import { PanelBody } from '@wordpress/components';
import { MediaUpload } from '@wordpress/media-utils';

/**
 * External Dependencies
 */
import { isEmpty } from 'lodash';
import CustomizeFooter from '../customize-footer';

/**
 * Internal Dependencies
 */
import ColorPicker from '../color-picker';
import ComboColorPicker from '../combo-color-picker';
import ColorPreview from '../color-preview';

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

	console.log( theme );

	const { title, properties } = { ...theme };

	const $properties = {
		...getDefaultThemeProperties(),
		...properties,
	};
	const {
		backgroundColor,
		backgroundImage,
		font,
		questionsColor,
		answersColor,
		buttonsFontColor,
		buttonsBgColor,
		errorsFontColor,
		errorsBgColor,
		progressBarBgColor,
		progressBarFillColor,
	} = $properties;
	return (
		<div className="theme-editor-customize">
			<PanelBody title="General Settings" initialOpen={ false }>
				<__experimentalBaseControl>
					<__experimentalControlWrapper orientation="horizontal">
						<__experimentalControlLabel label="Title" />
						<TextControl
							value={ title }
							onChange={ ( val ) => {
								setCurrentThemeTitle( val );
							} }
						/>
					</__experimentalControlWrapper>
					<__experimentalControlWrapper orientation="horizontal">
						<__experimentalControlLabel label="Font" />
						<FontPicker
							fonts={ configApi.getFonts() }
							selectedFont={ font }
							setFont={ ( value ) => {
								setCurrentThemeProperties( {
									font: value,
								} );
							} }
						/>
					</__experimentalControlWrapper>
				</__experimentalBaseControl>
				<__experimentalBaseControl>
					<__experimentalControlWrapper orientation="horizontal">
						<__experimentalControlLabel label="Background" />
						<ColorPreview color={ backgroundColor } />
					</__experimentalControlWrapper>
					<ComboColorPicker
						color={ backgroundColor }
						setColor={ ( value ) => {
							setCurrentThemeProperties( {
								backgroundColor: value,
							} );
						} }
					/>
				</__experimentalBaseControl>
				<__experimentalBaseControl>
					<__experimentalControlWrapper orientation="horizontal">
						<__experimentalControlLabel label="Background Image" />
						{ isEmpty( backgroundImage ) ? (
							<MediaUpload
								onSelect={ ( media ) =>
									setCurrentThemeProperties( {
										backgroundImage: {
											type: 'image',
											url: media.url,
										},
									} )
								}
								allowedTypes={ [ 'image' ] }
								render={ ( { open } ) => (
									<Button
										isSmall
										isSecondary
										onClick={ open }
									>
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
										backgroundImage: {},
									} )
								}
							>
								Remove
							</Button>
						) }
					</__experimentalControlWrapper>
				</__experimentalBaseControl>
			</PanelBody>
			<PanelBody title="Questions Settings" initialOpen={ false }>
				<__experimentalBaseControl>
					<__experimentalControlWrapper orientation="horizontal">
						<__experimentalControlLabel label="Color" />
						<ColorPreview color={ questionsColor } />
					</__experimentalControlWrapper>
					<ColorPicker
						value={ questionsColor }
						onChange={ ( value ) => {
							setCurrentThemeProperties( {
								questionsColor: value,
							} );
						} }
					/>
				</__experimentalBaseControl>
			</PanelBody>
			<PanelBody title="Answers Settings" initialOpen={ false }>
				<__experimentalBaseControl>
					<__experimentalControlWrapper orientation="horizontal">
						<__experimentalControlLabel label="Color" />
						<ColorPreview color={ answersColor } />
					</__experimentalControlWrapper>
					<ColorPicker
						value={ answersColor }
						onChange={ ( value ) => {
							setCurrentThemeProperties( {
								answersColor: value,
							} );
						} }
					/>
				</__experimentalBaseControl>
			</PanelBody>
			<PanelBody title="Buttons Settings" initialOpen={ false }>
				<__experimentalBaseControl>
					<__experimentalControlWrapper orientation="horizontal">
						<__experimentalControlLabel label="Text Color" />
						<ColorPreview color={ buttonsFontColor } />
					</__experimentalControlWrapper>
					<ColorPicker
						value={ buttonsFontColor }
						onChange={ ( value ) => {
							setCurrentThemeProperties( {
								buttonsFontColor: value,
							} );
						} }
					/>
				</__experimentalBaseControl>
				<__experimentalBaseControl>
					<__experimentalControlWrapper orientation="horizontal">
						<__experimentalControlLabel label="Background Color" />
						<ColorPreview color={ buttonsBgColor } />
					</__experimentalControlWrapper>
					<ComboColorPicker
						color={ buttonsBgColor }
						setColor={ ( value ) => {
							setCurrentThemeProperties( {
								buttonsBgColor: value,
							} );
						} }
					/>
				</__experimentalBaseControl>
			</PanelBody>
			<PanelBody title="Error Messages Settings" initialOpen={ false }>
				<__experimentalBaseControl>
					<__experimentalControlWrapper orientation="horizontal">
						<__experimentalControlLabel label="Text Color" />
						<ColorPreview color={ errorsFontColor } />
					</__experimentalControlWrapper>
					<ColorPicker
						value={ errorsFontColor }
						onChange={ ( value ) => {
							setCurrentThemeProperties( {
								errorsFontColor: value,
							} );
						} }
					/>
				</__experimentalBaseControl>
				<__experimentalBaseControl>
					<__experimentalControlWrapper orientation="horizontal">
						<__experimentalControlLabel label="Background Color" />
						<ColorPreview color={ errorsBgColor } />
					</__experimentalControlWrapper>
					<ComboColorPicker
						color={ errorsBgColor }
						setColor={ ( value ) => {
							setCurrentThemeProperties( {
								errorsBgColor: value,
							} );
						} }
					/>
				</__experimentalBaseControl>
			</PanelBody>
			<PanelBody title="Progress Bar Settings" initialOpen={ false }>
				<__experimentalBaseControl>
					<__experimentalControlWrapper orientation="horizontal">
						<__experimentalControlLabel label="Progress Bar Fill Color" />
						<ColorPreview color={ progressBarFillColor } />
					</__experimentalControlWrapper>
					<ColorPicker
						value={ progressBarFillColor }
						onChange={ ( value ) => {
							setCurrentThemeProperties( {
								progressBarFillColor: value,
							} );
						} }
					/>
				</__experimentalBaseControl>
				<__experimentalBaseControl>
					<__experimentalControlWrapper orientation="horizontal">
						<__experimentalControlLabel label="Progress Bar Background Color" />
						<ColorPreview color={ progressBarBgColor } />
					</__experimentalControlWrapper>
					<ColorPicker
						value={ progressBarBgColor }
						onChange={ ( value ) => {
							setCurrentThemeProperties( {
								progressBarBgColor: value,
							} );
						} }
					/>
				</__experimentalBaseControl>
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
