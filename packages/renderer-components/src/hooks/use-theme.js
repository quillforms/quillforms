import { useSelect } from '@wordpress/data';

const useTheme = () => {
	const { currentTheme } = useSelect( ( select ) => {
		return {
			currentTheme: select( 'quillForms/theme-editor' ).getCurrentTheme(),
		};
	} );

	return currentTheme;
};

export default useTheme;
