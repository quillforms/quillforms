/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

const useTheme = () => {
	const { currentThemeId } = useSelect( ( select ) => {
		return {
			currentThemeId: select(
				'quillForms/theme-editor'
			).getCurrentThemeId(),
		};
	} );

	return currentThemeId;
};

export default useTheme;
