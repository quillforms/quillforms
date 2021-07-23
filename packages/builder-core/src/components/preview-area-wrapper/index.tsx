/**
 * QuillForms Dependencies
 */
// @ts-expect-error
import { Form } from '@quillforms/renderer-core';
// @ts-expect-error
import { useTheme } from '@quillforms/theme-editor';
import configApi from '@quillforms/config';

/**
 * WordPress Dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import { cloneDeep } from 'lodash';
import Loader from 'react-loader-spinner';
import classnames from 'classnames';
import { css } from 'emotion';
/**
 * Internal Dependencies
 */
import PreviewArea from '../preview-area';
import { PreviewContextProvider } from '../preview-context';

let $timer;
interface Props {
	formId: number;
}
const FormPreview: React.FC< Props > = ( { formId } ) => {
	const theme = useTheme();

	const { hasThemesFinishedResolution } = useSelect( ( select ) => {
		// hasFinishedResolution isn't in select map and until now, @types/wordpress__data doesn't have it by default.
		const { hasFinishedResolution } = select( 'quillForms/theme-editor' );

		return {
			hasThemesFinishedResolution: hasFinishedResolution(
				'getCurrentTheme'
			),
		};
	} );

	const [ applyJumpLogic, setApplyJumpLogic ] = useState( false );
	const [ selfDispatch, setSelfDispatch ] = useState( false );
	const fonts = configApi.getFonts();
	const { font } = theme;
	const { currentBlockBeingEdited, blocks, messages, logic } = useSelect(
		( select ) => {
			return {
				currentBlockBeingEdited: select(
					'quillForms/block-editor'
				).getCurrentBlockId(),
				blocks: select( 'quillForms/block-editor' ).getBlocks(),
				messages: select( 'quillForms/messages-editor' ).getMessages(),
				logic: select( 'quillForms/logic-editor' )?.getLogic(),
			};
		}
	);
	const { setSwiper, goToBlock } = useDispatch( 'quillForms/renderer-core' );

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
		if ( font ) {
			link.href = fontUrl;
			const existingLinkEl = document.querySelector(
				`link[href='${ link.href }']`
			);
			if ( ! existingLinkEl ) head.appendChild( link );
		}
	}, [ font ] );

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
		if ( ! hasThemesFinishedResolution ) return;
		clearTimeout( $timer );
		if ( ! applyJumpLogic ) {
			const formFields = blocks.filter(
				( block ) =>
					block.name !== 'thankyou-screen' &&
					block.name !== 'welcome-screen'
			);

			const $thankyouScreens = blocks
				.filter( ( block ) => block.name === 'thankyou-screen' )
				.concat( {
					id: 'default_thankyou_screen',
					name: 'thankyou-screen',
				} );

			const $welcomeScreens = blocks.filter(
				( block ) => block.name === 'welcome-screen'
			);

			const $currentPath = cloneDeep( formFields );
			setSwiper( {
				walkPath: $currentPath,
				welcomeScreens: $welcomeScreens,
				thankyouScreens: $thankyouScreens,
			} );

			$timer = setTimeout( () => {
				goToBlock( currentBlockBeingEdited );
			}, 300 );
		}
	}, [
		JSON.stringify( blocks ),
		currentBlockBeingEdited,
		hasThemesFinishedResolution,
		applyJumpLogic,
	] );

	return (
		<div className="builder-core-preview-area-wrapper">
			{ ! hasThemesFinishedResolution ? (
				<div
					className={ classnames(
						'builder-core-preview-area-wrapper__loader',
						css`
							display: flex;
							width: 100%;
							height: 100%;
							background: #fff;
							align-items: center;
							justify-content: center;
						`
					) }
				>
					<Loader
						type="TailSpin"
						color="#333"
						height={ 30 }
						width={ 30 }
					/>
				</div>
			) : (
				<PreviewContextProvider
					value={ { applyJumpLogic, setApplyJumpLogic } }
				>
					{ /** @ts-expect-error */ }
					<PreviewArea.Slot>
						{ ( fills ) => (
							<>
								<Form
									formId={ formId }
									formObj={ {
										blocks: cloneDeep( blocks ),
										theme,
										messages,
										logic,
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
			) }
		</div>
	);
};

export default FormPreview;
