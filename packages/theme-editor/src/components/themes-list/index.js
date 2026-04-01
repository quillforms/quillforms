/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import ThemeCard from '../theme-card';
import ThemesListItem from '../themes-list-item';
import AddNewTheme from '../add-new-theme';
import Gallery from '../gallery';

import { css } from 'emotion';
const ThemesList = () => {
	const { themesList, currentThemeId } = useSelect((select) => {
		return {
			themesList: select('quillForms/theme-editor').getThemesList(),
			currentThemeId: select(
				'quillForms/theme-editor'
			).getCurrentThemeId(),
		};
	});
	const { setCurrentThemeId } = useDispatch('quillForms/theme-editor');

	return (
		<div className="theme-editor-themes-list">
			<AddNewTheme />

			{themesList.map((theme, index) => {
				return (
					<ThemeCard
						index={index}
						key={theme.id}
						isSelected={theme.id === currentThemeId}
					>
						<ThemesListItem
							theme={theme}
							onClick={() => {
								setCurrentThemeId(theme.id);
							}}
						/>
					</ThemeCard>
				);
			})}
			<Gallery />
		</div>
	);
};
export default ThemesList;
