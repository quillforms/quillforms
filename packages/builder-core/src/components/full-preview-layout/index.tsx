/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
/**
 * QuillForms Dependencies
 */
import { Form } from '@quillforms/renderer-core';
//@ts-expect-error.
import { useCurrentThemeId, useCurrentTheme } from '@quillforms/theme-editor';

/**
 * WordPress Dependencies
 */
import { useEffect, useState, createPortal } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { Icon } from '@wordpress/components';
import { arrowLeft, redo } from '@wordpress/icons';

/**
 * External Dependencies
 */
import { cloneDeep } from 'lodash';
import { TailSpin as Loader } from 'react-loader-spinner';
import classnames from 'classnames';
import { css } from 'emotion';
/**
 * Internal Dependencies
 */
import NoBlocks from '../no-blocks';
import RestartIcon from './restart-icon';

interface Props {
	formId: number;
	setFullPreviewMode: ( val: boolean ) => void;
}
const FullFormPreview: React.FC< Props > = ( {
	formId,
	setFullPreviewMode,
} ) => {
	const [ isReady, setIsReady ] = useState( false );

	const { resetAnswers, goToBlock, completeForm } = useDispatch(
		'quillForms/renderer-core'
	);

	const themeId = useCurrentThemeId();
	const currentTheme = useCurrentTheme();
	const { themesList, blocks, messages, logic, hiddenFields, settings } =
		useSelect( ( select ) => {
			// hasFinishedResolution isn't in select map and until now, @types/wordpress__data doesn't have it by default.
			return {
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

	useEffect( () => {
		resetAnswers();
		if ( blocks?.length > 0 ) {
			goToBlock( blocks[ 0 ].id );
		}
		setTimeout( () => {
			setIsReady( true );
		}, 500 );
	}, [ isReady ] );
	const $themesList = cloneDeep( themesList );
	if ( themeId ) {
		$themesList[
			$themesList.findIndex( ( theme ) => theme.id === themeId )
		] = {
			id: themeId,
			...currentTheme,
		};
	}
	const $hiddenFields = {};
	if ( hiddenFields ) {
		for ( const field of hiddenFields ) {
			if ( $hiddenFields[ field.name ] === undefined ) {
				$hiddenFields[ field.name ] = field.test;
			}
		}
	}

	return (
		<>
			{ createPortal(
				<div className="builder-core-full-preview-area-wrapper">
					{ ! isReady ? (
						<div
							className={ classnames(
								'builder-core-full-preview-area-wrapper__loader',
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
							<Loader color="#333" height={ 30 } width={ 30 } />
						</div>
					) : (
						<>
							<div className="builder-core-full-preview-area__header">
								<a
									className="builder-core-full-preview-area__back"
									onClick={ () => {
										setFullPreviewMode( false );
										resetAnswers();
									} }
								>
									<Icon icon={ arrowLeft } /> Back
								</a>
								<div className="builder-core-full-preview-area__title">
									Live Preview
								</div>
								<div
									className="builder-core-full-preview-area__restart"
									onClick={ () => {
										setIsReady( false );
										resetAnswers();
										if ( blocks?.length > 0 ) {
											goToBlock( blocks[ 0 ].id );
										}
									} }
								>
									<RestartIcon /> Restart
								</div>
							</div>
							<div className="builder-core-full-preview-area">
								{ blocks.length > 0 ? (
									<Form
										formId={ formId }
										formObj={ {
											blocks,
											theme: currentTheme?.properties,
											messages,
											logic,
											hiddenFields: $hiddenFields,
											themesList: $themesList,
											settings,
										} }
										applyLogic={ true }
										onSubmit={ () => {
											setTimeout( () => {
												completeForm();
											}, 500 );
										} }
										isPreview={ true }
									/>
								) : (
									<NoBlocks />
								) }
							</div>
						</>
					) }
				</div>,
				document.body
			) }
		</>
	);
};

export default FullFormPreview;
