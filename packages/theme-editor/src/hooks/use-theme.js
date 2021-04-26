/**
 * QuillForms Dependencies
 */
import { getDefaultThemeProperties } from '@quillforms/utils';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

const useTheme = () => {
	const { currentTheme } = useSelect( ( select ) => {
		return {
			currentTheme: select( 'quillForms/theme-editor' ).getCurrentTheme(),
		};
	} );

	return {
		...getDefaultThemeProperties(),
		...currentTheme.properties,
	};
};

export default useTheme;
