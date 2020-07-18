/* eslint no-console: [ 'error', { allow: [ 'error' ] } ] */
import { dispatch } from '@wordpress/data';

/**
 * Register Builder Panel
 *
 * @param {string} name     Panel unique name.
 * @param {Object} settings Panel settings.
 *
 */
export const registerBuilderPanel = ( name, settings ) => {
	settings = {
		name,
		...settings,
	};
	if ( typeof name !== 'string' ) {
		console.error( 'Builder panel names must be strings.' );
		return;
	}

	if ( settings.mode === 'single' && ! settings.render ) {
		console.error( "Single panels should have 'render' key" );
		return;
	}
	dispatch( 'quillForms/builder-panels' ).registerBuilderPanel( settings );
};
