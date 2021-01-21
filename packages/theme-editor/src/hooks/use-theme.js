/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import getDefaultThemeProperties from '../get-default-theme-properties';

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
