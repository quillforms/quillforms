/**
 * QuillForms Dependencies
 */
// @ts-expect-error
import { Form } from '@quillforms/renderer-core';
//@ts-expect-error
import { useCurrentThemeId, useCurrentTheme } from '@quillforms/theme-editor';

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
import NoBlocks from '../no-blocks';

let $timer;
interface Props {
	formId: number;
}
const FormPreview: React.FC< Props > = ( { formId } ) => {
	const themeId = useCurrentThemeId();
	const currentTheme = useCurrentTheme();
	console.log( themeId );
	console.log( currentTheme );
	const {
		hasThemesFinishedResolution,
		themesList,
		currentBlockBeingEdited,
		blocks,
		messages,
		logic,
	} = useSelect( ( select ) => {
		// hasFinishedResolution isn't in select map and until now, @types/wordpress__data doesn't have it by default.
		const { hasFinishedResolution } = select( 'quillForms/theme-editor' );

		return {
			hasThemesFinishedResolution: hasFinishedResolution(
				'getThemesList'
			),
			themesList: select( 'quillForms/theme-editor' ).getThemesList(),
			currentBlockBeingEdited: select(
				'quillForms/block-editor'
			).getCurrentBlockId(),
			blocks: select( 'quillForms/block-editor' ).getBlocks(),
			messages: select( 'quillForms/messages-editor' ).getMessages(),
			logic: select( 'quillForms/logic-editor' )?.getLogic(),
		};
	} );

	let $themesList = cloneDeep( themesList );
	console.log( themesList );
	if ( themeId ) {
		$themesList[
			$themesList.findIndex( ( theme ) => theme.id === themeId )
		] = {
			id: themeId,
			...currentTheme,
		};
	}

	const [ applyJumpLogic, setApplyJumpLogic ] = useState( false );
	const [ selfDispatch, setSelfDispatch ] = useState( false );
	const { setSwiper, goToBlock, completeForm } = useDispatch(
		'quillForms/renderer-core'
	);
	const { setCurrentBlock } = useDispatch( 'quillForms/block-editor' );

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
				<>
					{ blocks.length > 0 ? (
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
												themeId,
												messages,
												logic,
												themesList: $themesList,
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
					) : (
						<NoBlocks />
					) }
				</>
			) }
		</div>
	);
};

export default FormPreview;
