/**
 * QuillForms Dependencies
 */
import { Form } from '@quillforms/renderer-core';
//@ts-expect-error.
import { useCurrentThemeId, useCurrentTheme } from '@quillforms/theme-editor';

/**
 * WordPress Dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import { cloneDeep, omit, map } from 'lodash';
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
	const {
		hasThemesFinishedResolution,
		themesList,
		currentBlockBeingEdited,
		blocks,
		messages,
		logic,
		hiddenFields,
		settings,
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
			hiddenFields: select(
				'quillForms/hidden-fields-editor'
			)?.getHiddenFields(),
			settings: select( 'quillForms/settings-editor' ).getSettings(),
		};
	} );

	let $themesList = cloneDeep( themesList );
	if ( themeId ) {
		$themesList[
			$themesList.findIndex( ( theme ) => theme.id === themeId )
		] = {
			id: themeId,
			...currentTheme,
		};
	}
	let $hiddenFields = {};
	if ( hiddenFields ) {
		for ( const field of hiddenFields ) {
			if ( $hiddenFields[ field.name ] === undefined ) {
				$hiddenFields[ field.name ] = field.test;
			}
		}
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

			const $welcomeScreens = map(
				blocks.filter( ( block ) => block.name === 'welcome-screen' ),
				( block ) => omit( block, [ 'name' ] )
			);

			const $currentPath = cloneDeep( formFields );
			setSwiper( {
				walkPath: $currentPath,
				welcomeScreens: $welcomeScreens,
				thankyouScreens: $thankyouScreens,
			} );

			$timer = setTimeout( () => {
				if ( currentBlockBeingEdited )
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
												theme: currentTheme?.properties,
												messages,
												logic,
												hiddenFields: $hiddenFields,
												themesList: $themesList,
												settings,
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
