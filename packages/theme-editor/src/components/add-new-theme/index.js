/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
import { Icon } from '@wordpress/components';
import { plus } from '@wordpress/icons';

/**
 * Internal Dependencies
 */
import ThemeCard from '../theme-card';

const AddNewTheme = () => {
	const { setCurrentSubPanel } = useDispatch( 'quillForms/builder-panels' );
	const { setCurrentThemeId } = useDispatch( 'quillForms/theme-editor' );
	return (
		<div
			className="theme-editor-component-add-new-theme"
			role="presentation"
			onClick={ () => {
				setCurrentSubPanel( 'theme/customize' );
				setCurrentThemeId( null );
			} }
		>
			<ThemeCard>
				<Icon icon={ plus } color="#fff" />
				New Theme
			</ThemeCard>
		</div>
	);
};
export default AddNewTheme;
