/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

const useCurrentTheme = () => {
	const { currentTheme } = useSelect( ( select ) => {
		return {
			currentTheme: select( 'quillForms/theme-editor' ).getCurrentTheme(),
		};
	} );

	return currentTheme;
};

export default useCurrentTheme;
