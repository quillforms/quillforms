/**
 * WordPress Dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import ThemeCard from '../theme-card';
import ThemesListItem from '../themes-list-item';

const Gallery = () => {
	const { galleryThemes, currentThemeId } = useSelect( ( select ) => {
		return {
			galleryThemes: select(
				'quillForms/theme-editor'
			).getGalleryThemes(),
			currentThemeId: select(
				'quillForms/theme-editor'
			).getCurrentThemeId(),
		};
	} );

	const { setCurrentThemeId } = useDispatch( 'quillForms/theme-editor' );
	return (
		<>
			{ galleryThemes.map( ( theme, index ) => {
				return (
					<ThemeCard
						index={ index }
						key={ theme.id }
						isSelected={ theme.id === currentThemeId }
					>
						<ThemesListItem
							theme={ theme }
							onClick={ () => {
								setCurrentThemeId( theme.id );
							} }
						/>
					</ThemeCard>
				);
			} ) }
		</>
	);
};

export default Gallery;
