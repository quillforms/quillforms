/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/admin-components';
import { getDefaultThemeProperties } from '@quillforms/utils';

/**
 * WordPress Dependencies
 */
import { createPortal, useEffect } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';

/**
 * External Dependencies
 */
import { mapValues } from 'lodash';

/**
 * Internal Dependencies
 */
import IsSavingBtn from './is-saving-btn';

const CustomizeFooter = ( { themeId, themeTitle, themeProperties } ) => {
	const { themesList } = useSelect( ( select ) => {
		return {
			themesList: select( 'quillForms/theme-editor' ).getThemesList(),
		};
	} );
	themeProperties = mapValues( themeProperties, ( property ) => {
		if ( property === undefined ) {
			return '';
		}
		return property;
	} );

	const {
		addNewTheme,
		updateTheme,
		setCurrentThemeProperties,
		setCurrentThemeTitle,
	} = useDispatch( 'quillForms/theme-editor' );

	const { isSaving } = useSelect( ( select ) => {
		return {
			isSaving: select( 'quillForms/theme-editor' ).isSaving(),
		};
	} );

	useEffect( () => {
		document
			.querySelector( '.builder-core-panel__content-wrapper' )
			.classList.add( 'has-sticky-footer' );
		return () =>
			document
				.querySelector( '.builder-core-panel__content-wrapper' )
				.classList.remove( 'has-sticky-footer' );
	}, [] );

	return (
		<>
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
									setCurrentThemeTitle(
										themesList[ themeIndex ].title
									);
									return;
								}
							}
							setCurrentThemeProperties(
								getDefaultThemeProperties()
							);
							setCurrentThemeTitle( '' );
						}
					} }
				>
					Revert changes
				</Button>
				{ ! isSaving ? (
					<Button
						isPrimary
						onClick={ () => {
							if ( themeId ) {
								updateTheme(
									themeId,
									themeTitle,
									themeProperties
								);
							} else {
								addNewTheme( themeTitle, themeProperties );
							}
						} }
					>
						{ themeId ? 'Save changes' : 'Save as a new theme' }
					</Button>
				) : (
					<IsSavingBtn />
				) }
			</div>
		</>
	);
};

export default CustomizeFooter;
