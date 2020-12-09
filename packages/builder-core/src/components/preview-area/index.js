/**
 * WordPress Dependencies
 */
import { useEffect } from '@wordpress/element';

/**
 * QuillForms Dependencies
 */
import { useGlobalEditorContext } from '@quillforms/builder-components';
import { FormContentWrapper } from '@quillforms/renderer-core';
import { useTheme } from '@quillforms/utils';

const FormPreview = () => {
	const { fonts } = useGlobalEditorContext();
	const { font } = useTheme();
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

	return (
		<div className="builder-core-preview-area">
			<FormContentWrapper applyConditionalLogic={ false } />
		</div>
	);
};
export default FormPreview;
