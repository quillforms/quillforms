/**
 * WordPress Depdencies
 */
import { Fragment, useEffect } from '@wordpress/element';

const FontItem = ( { font, fontType } ) => {
	let fontUrl = null;
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

	return (
		<Fragment>
			<div
				className="builder-components-font-item__name"
				style={ { fontFamily: font } }
			>
				{ font }
			</div>
		</Fragment>
	);
};
export default FontItem;
