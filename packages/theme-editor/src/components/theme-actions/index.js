/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
import { DropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';
import { moreHorizontal } from '@wordpress/icons';

const ThemeActions = ( { id } ) => {
	const { setCurrentSubPanel } = useDispatch( 'quillForms/builder-panels' );

	return (
		<div className="theme-editor-theme-actions">
			<DropdownMenu
				icon={ moreHorizontal }
				position="bottom left"
				className="theme-editor-theme-actions__dropdown"
			>
				{ ( { onClose } ) => (
					<MenuGroup className="theme-editor-theme-actions__menu-group">
						<MenuItem
							className="theme-editor-theme-actions__menu-item"
							onClick={ () => {
								setCurrentSubPanel( 'customize' );
							} }
						>
							Customize
						</MenuItem>
						<MenuItem
							className="theme-editor-theme-actions__menu-item theme-editor-theme-actions__delete-theme"
							onClick={ () => {
								setCurrentSubPanel( 'customize' );
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
