/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import ThemeCard from '../theme-card';
import ThemesListItem from '../themes-list-item';
import AddNewTheme from '../add-new-theme';

const ThemesList = () => {
	const { themesList, currentThemeId } = useSelect( ( select ) => {
		return {
			themesList: select( 'quillForms/theme-editor' ).getThemesList(),
			currentThemeId: select(
				'quillForms/theme-editor'
			).getCurrentThemeId(),
		};
	} );

	return (
		<div className="theme-editor-themes-list">
			<AddNewTheme />

			{ themesList.map( ( theme ) => {
				return (
					<ThemeCard
						key={ theme.id }
						isSelected={ theme.id === currentThemeId }
					>
						<ThemesListItem theme={ theme } />
					</ThemeCard>
				);
			} ) }
		</div>
	);
};
export default ThemesList;
