/**
 * QuillForms Dependencies
 */
import ConfigAPI from '@quillforms/config';
import { getDefaultThemeProperties } from '@quillforms/utils';

/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * External Dependencies
 */
import classnames from 'classnames';
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import ThemeActions from '../theme-actions';

/**
 * An object describing a theme object.
 *
 * @typedef {Object} QFTheme
 *
 * @property {string} backgroundColor      The background color.
 * @property {string} backgroundImage      The background image.
 * @property {string} font 			       The selected font.
 * @property {string} questionsColor       The questions color.
 * @property {string} answersColor         The answers color.
 * @property {string} buttonsFontColor     The buttons font color.
 * @property {string} buttonsBgColor       The buttons background color.
 * @property {string} errorsFontColor      The error messages font color.
 * @property {string} errorsBgColor        The errors messages background color.
 * @property {string} progressBarFillColor The progress bar fill color.
 * @property {string} progressBarBgColor   The progress bar background color.
 *
 */

/**
 *
 * @param {QFTheme} theme
 */
const ThemesListItem = ( { theme, onClick } ) => {
	const themeId = theme.id;
	const themeData = {
		...getDefaultThemeProperties(),
		...theme.properties,
	};
	const { font } = themeData;
	const fonts = ConfigAPI.getFonts();

	const fontType = fonts[ font ];
	let fontUrl;
	switch ( fontType ) {
		case 'googlefonts':
			fontUrl =
				'https://fonts.googleapis.com/css?family=' +
				font +
				':100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic';

			break;

		case 'earlyaccess':
			const fontLowerString = font.replace( /\s+/g, '' ).toLowerCase();
			fontUrl =
				'https://fonts.googleapis.com/earlyaccess/' +
				fontLowerString +
				'.css';
			break;
	}
	useEffect( () => {
		const head = document.head;
		const link = document.createElement( 'link' );

		link.type = 'text/css';
		link.rel = 'stylesheet';
		link.href = fontUrl;

		if (
			fontUrl &&
			! document.querySelector( `link[href='${ link.href }']` )?.length
		)
			head.appendChild( link );
	}, [] );
	let backgroundImageCSS = '';
	if ( theme?.properties?.backgroundImage ) {
		backgroundImageCSS = `background: url('${ theme.properties.backgroundImage }') no-repeat;
			background-size: cover;
			background-position: center;
		`;
	}

	return (
		<div
			role="presentation"
			className="theme-editor-themes-list-item"
			onClick={ onClick }
		>
			<div
				className={ classnames(
					'theme-editor-themes-list-item__header-wrapper',
					css`
						${ backgroundImageCSS };
					`
				) }
			>
				<div
					className={ classnames(
						'theme-editor-themes-list-item__header',
						css`
							background: ${ themeData.backgroundColor };
							font-family: ${ themeData.font };
						`
					) }
				>
					<div
						className={ classnames(
							'theme-editor-themes-list-item__header-question',
							css`
								color: ${ themeData.questionsColor };
							`
						) }
					>
						Question
					</div>
					<div
						className={ classnames(
							'theme-editor-themes-list-item__header-answer',
							css`
								color: ${ themeData.answersColor };
							`
						) }
					>
						Answer
					</div>
					<div
						className={ classnames(
							'theme-editor-themes-list-item__header-buttons',
							css`
								color: ${ themeData.buttonsFontColor };
								background: ${ themeData.buttonsBgColor };
							`
						) }
					></div>
				</div>
			</div>
			<div className="theme-editor-themes-list-item__footer">
				<div className="theme-editor-themes-list-item__footer-title">
					{ theme.title ? theme.title : 'Untitled' }
				</div>
				<ThemeActions id={ theme.id } />
			</div>
		</div>
	);
};

export default ThemesListItem;
