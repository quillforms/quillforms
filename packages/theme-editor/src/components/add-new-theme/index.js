/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
import { Icon } from '@wordpress/components';
import { plus } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import ThemeCard from '../theme-card';

const AddNewTheme = () => {
	const { setCurrentThemeId, setCurrentTab } = useDispatch('quillForms/theme-editor');
	return (
		<div
			className="theme-editor-component-add-new-theme"
			role="presentation"
			onClick={() => {
				setCurrentTab('customize');
				setCurrentThemeId(null);
			}}
		>
			<ThemeCard>
				<Icon icon={plus} color="#fff" />
				{__('New Theme', 'quillforms')}
			</ThemeCard>
		</div>
	);
};
export default AddNewTheme;
