/**
 * QuillForms Dependencies
 */
import type { IconDescriptor, Icon as IconType } from '@quillforms/types';

/**
 * WordPress Dependencies
 */
import { memo, useState, useEffect } from 'react';
import { Tooltip, Icon, Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { plus } from '@wordpress/icons';
import { useSelect, useDispatch } from '@wordpress/data';
import { Button } from '@quillforms/admin-components';

/**
  External Dependencies
 */
import classnames from 'classnames';
import { css } from 'emotion';

interface Props {
	panelName: string;
	isSelected: boolean;
	index: number;
}
const PanelNavItem: React.FC< Props > = memo(
	( { panelName, isSelected, index } ) => {
		const [ isMounted, setIsMounted ] = useState( false );
		const [ pendingPanel, setPendingPanel ] = useState< string | null >( null );

		useEffect( () => {
			setTimeout( () => {
				setIsMounted( true );
			}, 100 );
		}, [] );
		const {
			panel,
			currentPanelName,
			shouldWarnThemeUnsavedChanges,
			currentTheme,
			currentThemeId,
			isThemeSaving,
		} = useSelect(
			( select ) => {
				const themeEditor = select( 'quillForms/theme-editor' );
				const builderPanels = select( 'quillForms/builder-panels' );
				const currentThemeTab = themeEditor?.getCurrentTab?.();
				const shouldThemeBeSaved = themeEditor?.shouldThemeBeSaved?.();
				const currentPanel = builderPanels.getCurrentPanelName();

				return {
					panel: builderPanels.getPanelByName( panelName ),
					currentPanelName: currentPanel,
					currentTheme: themeEditor?.getCurrentTheme?.() ?? {},
					currentThemeId: themeEditor?.getCurrentThemeId?.(),
					isThemeSaving: !! themeEditor?.isSaving?.(),
					shouldWarnThemeUnsavedChanges:
						currentPanel === 'theme' &&
						currentThemeTab === 'customize' &&
						!! shouldThemeBeSaved,
				};
			}
		);
		if ( ! panel ) return null;
		const icon = panel?.icon ? panel.icon : plus;

		const renderedIcon = (
			<Icon
				icon={
					( ( icon as IconDescriptor )?.src as IconType )
						? ( ( icon as IconDescriptor ).src as IconType )
						: ( icon as any )
				}
			/>
		);
		const { setCurrentPanel } = useDispatch( 'quillForms/builder-panels' );
		const { addNewTheme, updateTheme } = useDispatch( 'quillForms/theme-editor' );

		const tryNavigate = ( nextPanelName: string ) => {
			if (
				shouldWarnThemeUnsavedChanges &&
				currentPanelName !== nextPanelName
			) {
				setPendingPanel( nextPanelName );
				return;
			}
			setCurrentPanel( nextPanelName );
		};

		return (
			<div
				className={ classnames(
					'builder-core-builder-panel-nav-item',
					css`
						transform: scale( 0 );
						opacity: 0;
						transition: all 0.2s ease;
						transition-delay: ${ ( index + 1 ) * 0.1 }s;

						&.mounted {
							transform: scale( 1 );
							opacity: 1;
						}
					`,
					{
						active: isSelected ? true : false,
						mounted: isMounted,
					}
				) }
			>
				<Tooltip text={ panel.title } position="middle right">
					<div
						role="presentation"
						onClick={ () => tryNavigate( panel.name ) }
						className="builder-core-builder-panel-nav-item__icon"
					>
						{ renderedIcon }
					</div>
				</Tooltip>
				{ pendingPanel && (
					<Modal
						title={ __( 'Unsaved Changes', 'quillforms' ) }
						onRequestClose={ () => setPendingPanel( null ) }
						className={ css`
							border: none !important;
							border-radius: 16px;
							min-width: 440px !important;

							.components-modal__header-heading {
								color: #c5152b;
							}
						` }
					>
						<p>
							{ __(
								'You have unsaved changes. Do you want to change page without saving?',
								'quillforms'
							) }
						</p>
						<div
							className={ css`
								display: flex;
								justify-content: flex-end;
								gap: 12px;
								margin-top: 24px;
							` }
						>
							<Button
								className={ css`
									background: #d9d9d9 !important;
									border: 1px solid #d9d9d9 !important;
									color: #4b5563 !important;
									border-radius: 10px !important;
									padding: 8px 16px !important;
									min-height: 38px !important;
									font-size: 14px !important;
									font-weight: 500 !important;
									line-height: 1.2 !important;
									box-shadow: none !important;

									&:hover {
										background: #cfcfcf !important;
										border-color: #cfcfcf !important;
									}
								` }
								onClick={ () => setPendingPanel( null ) }
							>
								{ __( 'Cancel', 'quillforms' ) }
							</Button>
							<Button
								className={ css`
									background: #b2328c !important;
									border: 1px solid #b2328c !important;
									color: #fff !important;
									border-radius: 10px !important;
									padding: 8px 16px !important;
									min-height: 38px !important;
									font-size: 14px !important;
									font-weight: 600 !important;
									line-height: 1.2 !important;
									box-shadow: none !important;

									&:hover {
										background: #982a78 !important;
										border-color: #982a78 !important;
									}
								` }
								disabled={ isThemeSaving }
								onClick={ () => {
									if ( currentThemeId ) {
										updateTheme(
											currentThemeId,
											currentTheme?.title ?? '',
											currentTheme?.properties ?? {}
										);
									} else {
										addNewTheme(
											currentTheme?.title ?? '',
											currentTheme?.properties ?? {}
										);
									}
									setCurrentPanel( pendingPanel );
									setPendingPanel( null );
								} }
							>
								{ isThemeSaving
									? __( 'Saving…', 'quillforms' )
									: __( 'Save Changes', 'quillforms' ) }
							</Button>
						</div>
					</Modal>
				) }
			</div>
		);
	}
);

export default PanelNavItem;
