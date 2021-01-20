/**
 * WordPress Dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * QuillForms Dependencies
 */
import { useGlobalEditorContext } from '@quillforms/builder-components';
import { Form } from '@quillforms/renderer-core';
import { useTheme } from '@quillforms/theme-editor';

/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import { cloneDeep } from 'lodash';

/**
 * Internal Dependencies
 */
import PreviewArea from '../preview-area';
import { PreviewContextProvider } from '../preview-context';

let $timer;
const FormPreview = ( {} ) => {
	const [ applyJumpLogic, setApplyJumpLogic ] = useState( false );
	const [ selfDispatch, setSelfDispatch ] = useState( false );
	const { fonts } = useGlobalEditorContext();
	const theme = useTheme();
	const { font } = useTheme();
	const { currentBlockBeingEdited, blocks, messages } = useSelect(
		( select ) => {
			return {
				currentBlockBeingEdited: select(
					'quillForms/block-editor'
				).getCurrentBlockId(),
				blocks: select( 'quillForms/block-editor' ).getBlocks(),
				messages: select( 'quillForms/messages-editor' ).getMessages(),
			};
		}
	);
	const { setSwiper } = useDispatch( 'quillForms/renderer-core' );

	const { setCurrentBlock } = useDispatch( 'quillForms/block-editor' );
	const { completeForm } = useDispatch( 'quillForms/renderer-core' );
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

	useEffect( () => {
		clearTimeout( $timer );
		if ( ! applyJumpLogic ) {
			const formFields = blocks.filter(
				( block ) =>
					block.type !== 'thankyou-screen' &&
					block.type !== 'welcome-screen'
			);

			const $thankyouScreens = blocks
				.filter( ( block ) => block.type === 'thankyou-screen' )
				.concat( {
					id: 'default_thankyou_screen',
					type: 'thankyou-screen',
				} );

			const $welcomeScreens = blocks.filter(
				( block ) => block.type === 'welcome-screen'
			);

			const $isThankyouScreenActive =
				blocks[ currentBlockBeingEditedIndex ]?.type ===
				'thankyou-screen';

			const $isWelcomeScreenActive =
				blocks[ currentBlockBeingEditedIndex ]?.type ===
				'welcome-screen';
			const $currentPath = cloneDeep( formFields );
			setSwiper( {
				walkPath: $currentPath,
				welcomeScreens: $welcomeScreens,
				thankyouScreens: $thankyouScreens,
				isThankyouScreenActive: $isThankyouScreenActive,
				isWelcomeScreenActive: $isWelcomeScreenActive,
			} );

			const currentBlockBeingEditedIndex = blocks.findIndex(
				( $block ) => $block.id === currentBlockBeingEdited
			);

			const currentFieldBeingEditedIndex = formFields.findIndex(
				( $block ) => $block.id === currentBlockBeingEdited
			);

			const $nextBlockId =
				! $isThankyouScreenActive &&
				$currentPath?.length > 0 &&
				$currentPath[ currentFieldBeingEditedIndex + 1 ]
					? $currentPath[ currentFieldBeingEditedIndex + 1 ].id
					: undefined;
			const $prevBlockId =
				! $isThankyouScreenActive &&
				$currentPath?.length > 0 &&
				$currentPath[ currentBlockBeingEditedIndex - 1 ]
					? $currentPath[ currentBlockBeingEditedIndex - 1 ].id
					: undefined;
			$timer = setTimeout( () => {
				setSwiper( {
					isAnimating: true,
					currentBlockId: currentBlockBeingEdited,
					nextBlockId: $nextBlockId,
					prevBlockId: $prevBlockId,
					canGoNext: $isThankyouScreenActive ? false : true,
					canGoPrev:
						$prevBlockId && ! $isThankyouScreenActive
							? true
							: false,
					isSubmissionScreenActive: undefined,
				} );
			}, 300 );
		}
	}, [ JSON.stringify( blocks ), currentBlockBeingEdited ] );

	return (
		<div className="builder-core-preview-area-wrapper">
			<PreviewContextProvider
				value={ { applyJumpLogic, setApplyJumpLogic } }
			>
				<PreviewArea.Slot>
					{ ( fills ) => (
						<>
							<Form
								formObj={ {
									blocks,
									theme,
									messages,
									logic: null,
								} }
								applyLogic={ applyJumpLogic }
								onSubmit={ completeForm }
								isPreview={ true }
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
