/**
 * WordPress Dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * QuillForms Dependencies
 */
import { useGlobalEditorContext } from '@quillforms/builder-components';
import { FormContentWrapper } from '@quillforms/renderer-core';
import { useTheme } from '@quillforms/utils';
import { useSelect, useDispatch } from '@wordpress/data';
/**
 * Internal Dependencies
 */
import PreviewArea from '../preview-area';
import { PreviewContextProvider } from '../preview-context';

const FormPreview = ( {} ) => {
	const [ applyJumpLogic, setApplyJumpLogic ] = useState( false );
	const [ selfDispatch, setSelfDispatch ] = useState( false );
	const { fonts } = useGlobalEditorContext();
	const { font } = useTheme();

	const { currentBlockBeingEdited, blocks } = useSelect( ( select ) => {
		return {
			currentBlockBeingEdited: select(
				'quillForms/block-editor'
			).getCurrentBlockId(),
			blocks: select( 'quillForms/block-editor' ).getBlocks(),
		};
	} );

	const { setCurrentBlock } = useDispatch( 'quillForms/block-editor' );

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

	useEffect( () => {
		if ( applyJumpLogic ) {
			setSelfDispatch( true );
			setCurrentBlock( blocks[ 0 ].id );
		}
	}, [ applyJumpLogic ] );

	useEffect( () => {
		if ( ! selfDispatch && applyJumpLogic ) {
			setApplyJumpLogic( false );
		}
	}, [ currentBlockBeingEdited ] );

	useEffect( () => {
		if ( selfDispatch ) {
			setTimeout( () => {
				setSelfDispatch( false );
			}, 100 );
		}
	}, [ selfDispatch ] );

	return (
		<div className="builder-core-preview-area-wrapper">
			<PreviewContextProvider
				value={ { applyJumpLogic, setApplyJumpLogic } }
			>
				<PreviewArea.Slot>
					{ ( fills ) => (
						<>
							<FormContentWrapper
								applyJumpLogic={ applyJumpLogic }
							/>
							{ fills }
						</>
					) }
				</PreviewArea.Slot>
			</PreviewContextProvider>
		</div>
	);
};

export default FormPreview;
