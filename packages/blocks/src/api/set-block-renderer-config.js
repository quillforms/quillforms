/* eslint no-console: [ 'error', { allow: [ 'error' ] } ] */
import { dispatch } from '@wordpress/data';

/**
 * Set block renderer config
 * Set block renderer config is for defining UI behavior for the block
 *
 * @param {string} type     Block unique name.
 * @param {Object} config Block Configuration.
 *
 */
export const setBlockRendererConfig = ( type, config ) => {
	config = {
		type,
		...config,
	};
	if ( typeof type !== 'string' ) {
		console.error( 'Block types must be strings.' );
		return;
	}

	// If getRawValue isn't defined, define it with default behavior.
	if ( ! config.getRawValue ) config.getRawValue = ( val ) => String( val );

	// If counterContent isn't defined, define it with default value "arrow".
	if ( ! config.counterContent ) config.counterContent = 'arrow';

	dispatch( 'quillForms/blocks' ).addBlockRendererConfig( config );
};
