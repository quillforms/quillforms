/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/admin-components';
import { getDefaultThemeProperties } from '@quillforms/utils';

/**
 * WordPress Dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { mapValues } from 'lodash';

/**
 * Internal Dependencies
 */
import IsSavingBtn from './is-saving-btn';

const CustomizeFooter = ({
	themeId,
	themeTitle,
	themeProperties,
	canSave = true,
}) => {
	const { themesList } = useSelect((select) => {
		return {
			themesList: select('quillForms/theme-editor').getThemesList(),
		};
	});
	themeProperties = mapValues(themeProperties, (property) => {
		if (property === undefined) {
			return '';
		}
		return property;
	});

	const {
		addNewTheme,
		updateTheme,
		setCurrentThemeProperties,
		setCurrentThemeTitle,
	} = useDispatch('quillForms/theme-editor');

	const { isSaving } = useSelect((select) => {
		return {
			isSaving: select('quillForms/theme-editor').isSaving(),
		};
	});

	return (
		<>
			<div className="theme-editor-customize-footer">
				<Button
					isDefault
					className="theme-editor-customize-footer__btn theme-editor-customize-footer__btn--clear"
					disabled={isSaving}
					onClick={() => {
						if (!isSaving) {
							if (themeId) {
								const themeIndex = themesList.findIndex(
									($theme) => $theme.id === themeId
								);
								if (themeIndex !== -1) {
									setCurrentThemeProperties(
										themesList[themeIndex].properties
									);
									setCurrentThemeTitle(
										themesList[themeIndex].title
									);
									return;
								}
							}
							setCurrentThemeProperties(
								getDefaultThemeProperties()
							);
							setCurrentThemeTitle('');
						}
					}}
				>
					{__('Clear', 'quillforms')}
				</Button>
				{!isSaving ? (
					<Button
						isPrimary
						className="theme-editor-customize-footer__btn theme-editor-customize-footer__btn--save"
						disabled={!canSave}
						onClick={() => {
							if (!canSave) {
								return;
							}
							if (themeId) {
								updateTheme(
									themeId,
									themeTitle,
									themeProperties
								);
							} else {
								addNewTheme(themeTitle, themeProperties);
							}
						}}
					>
						{__('Save', 'quillforms')}
					</Button>
				) : (
					<IsSavingBtn />
				)}
			</div>
		</>
	);
};

export default CustomizeFooter;
