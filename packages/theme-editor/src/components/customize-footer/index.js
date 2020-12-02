/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/builder-components';

/**
 * WordPress Dependencies
 */
import { createPortal } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { uniqueId } from 'lodash';

const CustomizeFooter = ( { themeId, themeData } ) => {
	const { addNewTheme, setCurrentThemeId } = useDispatch(
		'quillForms/theme-editor'
	);
	const { setCurrentSubPanel } = useDispatch( 'quillForms/builder-panels' );

	return createPortal(
		<div className="theme-editor-customize-footer">
			<Button isDefault onClick={ () => {} }>
				Cancel
			</Button>
			<Button
				isPrimary
				onClick={ () => {
					if ( themeId ) {
					} else {
						const generatedThemeId = uniqueId();
						addNewTheme( generatedThemeId, themeData );
						setCurrentSubPanel( 'my-themes' );
						setCurrentThemeId( generatedThemeId );
					}
				} }
			>
				{ themeId ? 'Save changes' : 'Save as a new theme' }
			</Button>
		</div>,
		document.querySelector( '.builder-core-panel' )
	);
};

export default CustomizeFooter;
