/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
import { DropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import ThemeActionsMenuIcon from './actions-icon';

const ThemeActions = ({ id, themeTitle, themeProperties }) => {
	const {
		setCurrentTab,
		deleteTheme,
		addNewTheme,
		setCurrentThemeId,
		setShouldBeSaved,
	} = useDispatch('quillForms/theme-editor');

	return (
		<div
			role="presentation"
			className="theme-editor-theme-actions"
			onClick={(e) => e.stopPropagation()}
		>
			<DropdownMenu
				popoverProps={ {
					placement: 'bottom-start',
				} }
				icon={ <ThemeActionsMenuIcon /> }
				label={ __( 'Theme actions', 'quillforms' ) }
				className="theme-editor-theme-actions__dropdown"
			>
				{({ onClose }) => (
					<MenuGroup className="theme-editor-theme-actions__menu-group">
						<MenuItem
							className="theme-editor-theme-actions__menu-item"
							onClick={() => {
								setCurrentThemeId(id);
								setCurrentTab('customize');
								setShouldBeSaved(false);
							}}
						>
							{ __( 'Customize', 'quillforms' ) }
						</MenuItem>
						<MenuItem
							className="theme-editor-theme-actions__menu-item"
							onClick={() => {
								addNewTheme(
									themeTitle + '-copy',
									themeProperties
								);
								onClose();
							}}
						>
							{__('Duplicate', 'quillforms')}
						</MenuItem>
						<MenuItem
							className="theme-editor-theme-actions__menu-item"
							onClick={() => {
								onClose();
								deleteTheme(id);
							}}
						>
							{__('Delete', 'quillforms')}
						</MenuItem>
					</MenuGroup>
				)}
			</DropdownMenu>
		</div>
	);
};
export default ThemeActions;
