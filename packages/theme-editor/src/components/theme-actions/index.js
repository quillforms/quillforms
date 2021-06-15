/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
import { DropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';
import { moreHorizontal } from '@wordpress/icons';

const ThemeActions = ( { id } ) => {
	const { setCurrentSubPanel } = useDispatch( 'quillForms/builder-panels' );
	const { deleteTheme, setCurrentThemeId, setShouldBeSaved } = useDispatch(
		'quillForms/theme-editor'
	);

	return (
		<div
			role="presentation"
			className="theme-editor-theme-actions"
			onClick={ ( e ) => e.stopPropagation() }
		>
			<DropdownMenu
				icon={ moreHorizontal }
				popoverProps={ {
					position: 'bottom left',
				} }
				className="theme-editor-theme-actions__dropdown"
			>
				{ ( { onClose } ) => (
					<MenuGroup className="theme-editor-theme-actions__menu-group">
						<MenuItem
							className="theme-editor-theme-actions__menu-item"
							onClick={ () => {
								setCurrentThemeId( id );
								setCurrentSubPanel( 'theme/customize' );
								setShouldBeSaved( false );
							} }
						>
							Customize
						</MenuItem>
						<MenuItem
							className="theme-editor-theme-actions__menu-item theme-editor-theme-actions__delete-theme"
							onClick={ () => {
								onClose();
								deleteTheme( id );
							} }
						>
							Delete
						</MenuItem>
					</MenuGroup>
				) }
			</DropdownMenu>
		</div>
	);
};
export default ThemeActions;
