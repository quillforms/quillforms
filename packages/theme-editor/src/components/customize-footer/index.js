/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/admin-components';
import { getDefaultThemeProperties } from '@quillforms/utils';

/**
 * WordPress Dependencies
 */
import { useEffect } from 'react';
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

const CustomizeFooter = ({ themeId, themeTitle, themeProperties }) => {
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

	useEffect(() => {
		document
			.querySelector('.builder-core-block-right-panel .tab-content')
			.classList.add('has-sticky-footer');
		return () => {
			if (document.querySelector('.builder-core-block-right-panel .tab-content')) {
				document
					.querySelector('.builder-core-block-right-panel .tab-content')
					.classList.remove('has-sticky-footer');
			}
		}
	}, []);

	return (
		<>
			<div className="theme-editor-customize-footer">
				<Button
					isDefault
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
					{__('Revert changes', 'quillforms')}
				</Button>
				{!isSaving ? (
					<Button
						isPrimary
						onClick={() => {
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
						{themeId ? __('Save changes', 'quillforms') : __('Save as a new theme', 'quillforms')}
					</Button>
				) : (
					<IsSavingBtn />
				)}
			</div>
		</>
	);
};

export default CustomizeFooter;
