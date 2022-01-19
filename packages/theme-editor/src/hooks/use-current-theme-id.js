/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

const useCurrentThemeId = () => {
	const { currentThemeId } = useSelect( ( select ) => {
		return {
			currentThemeId: select(
				'quillForms/theme-editor'
			).getCurrentThemeId(),
		};
	} );

	return currentThemeId;
};

export default useCurrentThemeId;
