/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
/**
 * External Dependencies
 */
import AddIcon from '@material-ui/icons/Add';

/**
 * Internal Dependencies
 */
import ThemeCard from '../theme-card';

const AddNewTheme = () => {
	const { setCurrentSubPanel } = useDispatch( 'quillForms/builder-panels' );
	const { setShouldBeSaved, setCurrentThemeId } = useDispatch(
		'quillForms/theme-editor'
	);
	return (
		<div
			className="theme-editor-component-add-new-theme"
			role="presentation"
			onClick={ () => {
				setCurrentSubPanel( 'customize' );
				setCurrentThemeId( null );
				setShouldBeSaved( true );
			} }
		>
			<ThemeCard>
				<AddIcon />
				New Theme
			</ThemeCard>
		</div>
	);
};
export default AddNewTheme;
