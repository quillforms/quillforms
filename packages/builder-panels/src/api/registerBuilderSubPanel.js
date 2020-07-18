/* eslint no-console: [ 'error', { allow: [ 'error' ] } ] */
import { dispatch } from '@wordpress/data';

/**
 * Register Builder Sub Panel
 *
 * @param {string} name     Subpanel unique name.
 * @param {Object} settings Subpanel settings.
 *
 */
export const registerBuilderSubPanel = ( name, settings ) => {
	settings = {
		name,
		...settings,
	};
	if ( typeof name !== 'string' ) {
		console.error( 'Builder panel names must be strings.' );
		return;
	}
	if ( ! settings.parent ) {
		console.error(
			"Builder sub panel settings should include 'parnet' key."
		);
		return;
	}
	dispatch( 'quillForms/builder-panels' ).registerBuilderSubPanel( settings );
};
