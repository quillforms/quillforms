/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/builder-components';

/**
 * WordPress Dependencies
 */
import { createPortal } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import IsSavingBtn from './is-saving-btn';

const CustomizeFooter = ( { themeId, themeProperties } ) => {
	const { themesList } = useSelect( ( select ) => {
		return {
			themesList: select( 'quillForms/theme-editor' ).getThemesList(),
		};
	} );
	const { addNewTheme, updateTheme, setShouldBeSaved } = useDispatch(
		'quillForms/theme-editor'
	);
	const { setCurrentSubPanel, setCurrentThemeProperties } = useDispatch(
		'quillForms/builder-panels'
	);

	const { isSaving } = useSelect( ( select ) => {
		return {
			isSaving: select( 'quillForms/theme-editor' ).isSaving(),
		};
	} );

	return createPortal(
		<div className="theme-editor-customize-footer">
			<Button
				isDefault
				onClick={ () => {
					if ( ! isSaving ) {
						if ( themeId ) {
							const themeIndex = themesList.findIndex(
								( $theme ) => $theme.id === themeId
							);
							if ( themeIndex !== -1 ) {
								setCurrentThemeProperties(
									themesList[ themeIndex ].properties
								);
								return;
							}
						}
						setCurrentThemeProperties( {} );
					}
					setCurrentSubPanel( 'my-themes' );
				} }
			>
				Revert changes
			</Button>
			{ ! isSaving ? (
				<Button
					isPrimary
					onClick={ () => {
						if ( themeId ) {
							updateTheme( themeId, '', themeProperties );
						} else {
							addNewTheme( '', themeProperties );
						}
					} }
				>
					{ themeId ? 'Save changes' : 'Save as a new theme' }
				</Button>
			) : (
				<IsSavingBtn />
			) }
		</div>,
		document.querySelector( '.builder-core-panel' )
	);
};

export default CustomizeFooter;
