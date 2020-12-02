/**
 * QuillForms Dependencies
 */
import {
	__experimentalBaseControl,
	__experimentalControlWrapper,
	__experimentalControlLabel,
	Button,
	ColorPicker,
	FontPicker,
	ComboColorPicker,
	ColorPreview,
	useGlobalEditorContext,
} from '@quillforms/builder-components';

/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { PanelBody } from '@wordpress/components';
import { MediaUpload } from '@wordpress/media-utils';

/**
 * External Dependencies
 */
import isEmpty from 'lodash/isEmpty';
import CustomizeFooter from '../customize-footer';

const CustomizeThemePanel = () => {
	const editorContext = useGlobalEditorContext();

	const { setThemeProperties } = useDispatch( 'quillForms/theme-editor' );
	const { theme, shouldBeSaved, currentThemeId } = useSelect( ( select ) => {
		return {
			theme: select( 'quillForms/theme-editor' ).getCurrentTheme(),
			shouldBeSaved: select(
				'quillForms/theme-editor'
			).shouldThemeBeSaved(),
			currentThemeId: select(
				'quillForms/theme-editor'
			).getCurrentThemeId(),
		};
	} );

	return (
		<div className="theme-editor-customize">
			<PanelBody title="General Settings" initialOpen={ false }>
				<__experimentalBaseControl>
					<__experimentalControlWrapper orientation="horizontal">
						<__experimentalControlLabel label="Font" />
						<FontPicker
							fonts={ editorContext.fonts }
							selectedFont={ theme.font }
							setFont={ ( font ) => {
								setThemeProperties( {
									font,
								} );
							} }
						/>
					</__experimentalControlWrapper>
				</__experimentalBaseControl>
				<__experimentalBaseControl>
					<__experimentalControlWrapper orientation="horizontal">
						<__experimentalControlLabel label="Background" />
						<ColorPreview color={ theme.backgroundColor } />
					</__experimentalControlWrapper>
					<ComboColorPicker
						color={ theme.backgroundColor }
						setColor={ ( value ) => {
							setThemeProperties( {
								backgroundColor: value,
							} );
						} }
					/>
				</__experimentalBaseControl>
				<__experimentalBaseControl>
					<__experimentalControlWrapper orientation="horizontal">
						<__experimentalControlLabel label="Background Image" />
						{ isEmpty( theme.backgroundImage ) ? (
							<MediaUpload
								onSelect={ ( media ) =>
									setThemeProperties( {
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
									setThemeProperties( {
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
						<ColorPreview color={ theme.questionsColor } />
					</__experimentalControlWrapper>
					<ColorPicker
						value={ theme.questionsColor }
						onChange={ ( value ) => {
							setThemeProperties( {
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
						<ColorPreview color={ theme.answersColor } />
					</__experimentalControlWrapper>
					<ColorPicker
						value={ theme.answersColor }
						onChange={ ( value ) => {
							setThemeProperties( {
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
						<ColorPreview color={ theme.buttonsFontColor } />
					</__experimentalControlWrapper>
					<ColorPicker
						value={ theme.buttonsFontColor }
						onChange={ ( value ) => {
							setThemeProperties( {
								buttonsFontColor: value,
							} );
						} }
					/>
				</__experimentalBaseControl>
				<__experimentalBaseControl>
					<__experimentalControlWrapper orientation="horizontal">
						<__experimentalControlLabel label="Background Color" />
						<ColorPreview color={ theme.buttonsBgColor } />
					</__experimentalControlWrapper>
					<ComboColorPicker
						color={ theme.buttonsBgColor }
						setColor={ ( value ) => {
							setThemeProperties( {
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
						<ColorPreview color={ theme.errorsFontColor } />
					</__experimentalControlWrapper>
					<ColorPicker
						value={ theme.errorsFontColor }
						onChange={ ( value ) => {
							setThemeProperties( {
								errorsFontColor: value,
							} );
						} }
					/>
				</__experimentalBaseControl>
				<__experimentalBaseControl>
					<__experimentalControlWrapper orientation="horizontal">
						<__experimentalControlLabel label="Background Color" />
						<ColorPreview color={ theme.errorsBgColor } />
					</__experimentalControlWrapper>
					<ComboColorPicker
						color={ theme.errorsBgColor }
						setColor={ ( value ) => {
							setThemeProperties( {
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
						<ColorPreview color={ theme.progressBarFillColor } />
					</__experimentalControlWrapper>
					<ColorPicker
						value={ theme.progressBarFillColor }
						onChange={ ( value ) => {
							setThemeProperties( {
								progressBarFillColor: value,
							} );
						} }
					/>
				</__experimentalBaseControl>
				<__experimentalBaseControl>
					<__experimentalControlWrapper orientation="horizontal">
						<__experimentalControlLabel label="Progress Bar Background Color" />
						<ColorPreview color={ theme.progressBarBgColor } />
					</__experimentalControlWrapper>
					<ColorPicker
						value={ theme.progressBarBgColor }
						onChange={ ( value ) => {
							setThemeProperties( {
								progressBarBgColor: value,
							} );
						} }
					/>
				</__experimentalBaseControl>
			</PanelBody>
			{ shouldBeSaved && (
				<CustomizeFooter
					themeData={ theme }
					themeId={ currentThemeId }
				/>
			) }
		</div>
	);
};
export default CustomizeThemePanel;
